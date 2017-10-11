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

```json
{
  meetings {
    meetingId
    name
    duration
    dialNumber
    attendePassword
    moderatorPassword
    metadata {
      name
      value
    }
	}
}
```

```json
{
  meetings {
    uniqueMeetingId
    running
  }
}
```

```json
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
