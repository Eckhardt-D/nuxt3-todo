# Development Notes

Adding a database

- Sign up at https://app.planetscale.com/
- Create a new database and copy the DATABASE_URL to .env
- Promote the new database to production immediately

## Making Schema Changes with PlanetScale and Prisma

- install the planetscale cli at https://planetscale.com/cli

- login to your planetscale account

        pscale auth login

- Copy the env from dist env

        cp .env.dist .env

- Create a new branch from main in PlanetScale

        pscale branch create nuxt3-todos user-todos-add

- Run the local PlanetScale proxy

        pscale connect nuxt3-todos user-todos-add

- Define your Prisma schema `see prisma/schema.prisma`
- Run the push

        npx prisma db push

- Merge the dev branch in PlanetScale, delete the old branch

        pscale deploy-request create nuxt3-todos user-todos-add

- Deploy the schema changes (review in planetscale) - <num>: the number of the deploy request generated above

        pscale deploy-request deploy nuxt3-todos <num>
