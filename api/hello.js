export default function handler(request, response) {
    const { name } = request.query;
    response.status(200).send(`Hello ${name}!`);
  }
//https://codelrond-dev.atlassian.net/browse/C2VRAYC-1