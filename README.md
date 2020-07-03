# Proverest: Back-End Developer Test

Task
Hello! Here we're going to create a small app that queries the Google analytics API to return the results of the number of unique visitors to a website over the past 24 hours.

* Authenticate the user
* Run the query
* Return the results
* Calculate the percentage increase in users since yesterday and the median for past 7 days 5. Store the results in a database

Result
We do not expect the code to be functional or for you to implement a database. You can use a fake token as a placeholder.
We will be looking for well formatted, efficient code, which given the correct user parameters and database structure will function correctly.
Please send us the link to your code in GitHub or Bitbucket.

---

# How to use this project

* Docker and docker-compose are required.
* Yarn is required (https://yarnpkg.com/en/docs/install)

**Project setup:**

``
yarn install
``

**Run project**

You need to open 2 terminal window.

Terminal 1:

``
docker-compose up
``

Terminal 2:

``
yarn build:reporting && yarn start:reporting
``
or
``
yarn build:transfer && yarn start:transfer
``

**Test project**

``
yarn test
``
