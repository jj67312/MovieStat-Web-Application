import pickle
import json
from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

movies = pickle.load(open('movie_list.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))


def recommend(movie):
    index = movies[movies['title'] == movie].index[0]
    distances = sorted(
        list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_movie_names = []
    for i in distances[1:6]:
        recommended_movie_names.append(movies.iloc[i[0]].title)

    return recommended_movie_names


class Recommender(Resource):
    def get(self, selected_movie):
        recommended_movie_names = recommend(selected_movie)
        movie_names = {"movie_1":recommended_movie_names[0],"movie_2":recommended_movie_names[1],"movie_3":recommended_movie_names[2],"movie_4":recommended_movie_names[3],"movie_5":recommended_movie_names[4]}
        
        print(json.dumps(movie_names))
        return json.dumps(movie_names)
        # return movie_names


api.add_resource(Recommender, "/<string:selected_movie>")

if __name__ == "__main__":
    app.run(debug=True)
