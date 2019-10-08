const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
// GraphQL schema
const schema = buildSchema(`
    type Author {
      id: Int
      name: String
    },
    type Query {
        author(id: Int): Author
        authors: [Author]
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Course {
        id: Int
        title: String
        author: Author
        description: String
        topic: String
        url: String
    }
`);

const authorsData = [
  {
    id: 1,
    name: "Andrew Mead, Rob Percival"
  },
  {
    id: 2,
    name: "Brad Traversy"
  },
  {
    id: 3,
    name: "Anthony Alicea"
  }
];

const getAuthor = function(args) {
  console.log(args);
  const id = args.id;
  return authorsData.filter(author => {
    return author.id == id;
  })[0];
};

const getAuthors = function(args) {
  return authorsData;
};

const coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: getAuthor({ id: 1 }),
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/"
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: getAuthor({ id: 2 }),
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/"
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: getAuthor({ id: 3 }),
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/"
  }
];

const getCourse = function(args) {
  const id = args.id;
  return coursesData.filter(course => {
    return course.id == id;
  })[0];
};

const getCourses = function(args) {
  if (args.topic) {
    const topic = args.topic;
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
};

const root = {
  course: getCourse,
  courses: getCourses,
  author: getAuthor,
  authors: getAuthors
};
// Create an express server and a GraphQL endpoint
const app = express();
app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
