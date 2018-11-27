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

If you want to use the option redis component, make sure you have redis running propery:

```
docker run --rm -d --name redis -p 6379:6379 redis
# Also add the key it'll look for
echo "SET messagekey \"I am in a docker container please send help\"" | nc -v localhost 6379
```


## Building

Dockerfile provided one directory up as `api.Dockerfile`.