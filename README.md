# Development Notes

Adding a database

- Sign up at https://app.planetscale.com/
- Create a new database and copy the DATABASE_URL to .env
- Promote the new database to production immediately

## Making Schema Changes with PlanetScale and Prisma

- Create a new branch from main in the PlanetScale dashboard
- Copy the connection string and replace in .env (keep your old one)
- Define your Prisma schema `see prisma/schema.prisma`
- Run the push

        npx prisma db push

- Merge the dev branch in PlanetScale, delete the old branch
- Change your connection uri back to the production uri
