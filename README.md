### Install and run

```
npm install
node app.js
```

### Examples

```
curl -H "Content-Type:application/graphql" -X POST -d '{ meetings { meetingId name duration metadata { name value } } }' "http://localhost:4000/graphql"
curl -H "Content-Type:application/graphql" -X POST -d 'mutation { createMeeting(params: {meetingId:"pedro-meeting" name:"Pedro Legal"}) {meetingId name duration metadata { name value }} }' "http://localhost:4000/graphql"
```

Queries

```graphql
{
  meetings {
    meetingId
    uniqueMeetingId
    name
    metadata {
      name
      value
    }
    users {
      userId
      uniqueUserId
      fullName
      role
    }
  }
}
```

```graphql
{
  meetings {
    uniqueMeetingId
    running
  }
}
```

```graphql
mutation {
  createMeeting(params: {
    meetingId: "pedro-meeting",
    name: "Pedro Legal",
    metadata: [
      {
        name:"m1",
        value:"lalala"
      }
    ]
  }
  ) {
    meetingId
    name
    duration
    metadata { name value }
  }
}
```
