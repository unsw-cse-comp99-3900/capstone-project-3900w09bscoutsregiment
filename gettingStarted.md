Docker installation:

1. Clone the repo : [https://github.com/unsw-cse-comp99-3900-24t1/capstone-project-3900w09bscoutsregiment]

Via ssh:
git clone git@github.com:unsw-cse-comp99-3900-24t1/capstone-project-3900w09bscoutsregiment.git

2. Navigate to the repo

cd capstone-project-3900w09bscoutsregiment

3. Build the docker container

docker-compose up

4. Navigate to localhost:3000
   Once you navigate to localhost:3000 you can start using the app 😄.
   Note that it might take a few second for ANY page to render.

Installation if docker fails:

Assuming we have done the steps in [Docker installation] above and things failed. We are going to manually run the frontend and backend.

1. Stop the docker container.

CTRL + c

2. Once the docker container stops navigate to frontend and install the node modules

cd frontend
npm install 3. Navigate to backend and install the node modules

cd ../backend
npm install

# Once the node modules is installed, we can run the backend

npm run dev

4. Open a new terminal and run the frontend

cd capstone-project-3900w09bscoutsregiment/frontend
npm run dev

5. Navigate to localhost:3000

Navigate to local host 3000 and the app should be working correctly.
