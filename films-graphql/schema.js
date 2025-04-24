const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = require("graphql");
const db = require("./db");

// Definir el tipo Film
const FilmType = new GraphQLObjectType({
  name: "Film",
  fields: () => ({
    film_id: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    release_year: { type: GraphQLString },
    language_id: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    films: {
      type: new GraphQLList(FilmType),
      resolve: async () => {
        const [rows] = await db.query("SELECT * FROM film LIMIT 20");
        return rows;
      },
    },
    film: {
      type: FilmType,
      args: { id: { type: GraphQLInt } },
      resolve: async (_, args) => {
        const [rows] = await db.query("SELECT * FROM film WHERE film_id = ?", [args.id]);
        return rows[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
