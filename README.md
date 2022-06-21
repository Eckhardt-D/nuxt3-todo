# Development Notes

Note: for local development make sure your database is running first in another terminal (see below for more info):

        pscale connect nuxt3-todos main

Adding a database (required).

- Sign up at https://app.planetscale.com/
- Create a new database and copy the DATABASE_URL to .env of your prod environment
- Promote the new database to production immediately in planetscale

## Making Schema Changes with PlanetScale and Prisma

- install the planetscale cli at https://planetscale.com/cli

- login to your planetscale account

        pscale auth login

- Copy the env from dist env

        cp .env.dist .env

- Create a new branch from main in PlanetScale

        pscale branch create nuxt3-todos user-todos-add

- Run the local PlanetScale proxy on the new branch

        pscale connect nuxt3-todos user-todos-add

- Define your Prisma schema `see prisma/schema.prisma`
- Run the push

        npx prisma db push

- Merge the dev branch in PlanetScale

        pscale deploy-request create nuxt3-todos user-todos-add

- Deploy the schema changes (review in planetscale) - <num>: the number of the deploy request generated above

        pscale deploy-request deploy nuxt3-todos <num>

- Delete the unused branch

        pscale branch delete nuxt3-todos user-todos-add

- List branches in PlanetScale

        pscale branch list nuxt3-todos

## Issues with DATABASE_URL ?

Add the .env file and run

        npx prisma generate
