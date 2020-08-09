
const axios = require('axios')

exports.handler = async (event, context) => {
  let request
  try {
    const uri = 'GRAPHQL ENDPOINT'
    const parsed = JSON.parse(event.body)
    const data = parsed.event.data.new
    const singupMutation = JSON.stringify({
    query: `
      mutation Singup($auth0_id: String!, $name: String!, $email: String !) {
        insert_users(objects: {auth0_id: $auth0_id, email: $email, name: $name}) {
          affected_rows
        }
      }  
    `,
    variables: {
        auth0_id: data.id,
        name: data.display_name,
        email: data.display_name
      }
    })
    
    const result = await axios.post(uri, singupMutation, {
        headers: {'content-type' : 'application/json', 
        'x-hasura-admin-secret': process.env.HASURA_SECRET, 
        'x-hasura-role': 'admin'},
    })
  } catch (e) {
    return { statusCode: 400, body: 'cannot parse hasura event' }
  }
}
