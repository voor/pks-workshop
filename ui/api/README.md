# Super Simple API Sample

This is a very basic ExpressJS app that provides a user (always the same), the ability to look up user's by an `id` (consistently "random" responses), and the ability to look up random list of multiple users.

Routes:

`/` just a hello world.
`/user/` returns the same user from a faker seed.
`/user/:id` returns a user with a given `id`
`/users/:num` returns a list of users in length equal to `num`.

## Running

```
npm install
npm start
```

## Building

Dockerfile provided one directory up as `api.Dockerfile`.