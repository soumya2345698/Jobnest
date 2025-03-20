import './dotenv.js'
// Modules Imported
import express, { urlencoded } from 'express';
import ejs from 'ejs';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import UserController from './src/controllers/users.controllers.js';
import RecruiterController from './src/controllers/recruiters.controller.js';
import JobController from './src/controllers/jobs.controller.js';
import {auth} from './middlewares/auth.middleware.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { uploadFile } from './middlewares/file-upload.middleware.js';
import { setLastVisit } from './middlewares/lastVisit.middleware.js';

// Server create
const app = express();

// Cookies Parser
app.use(cookieParser());
app.use(setLastVisit);

// Session Create
app.use(session({
    secret : "SecretKey",
    resave : false,
    saveUninitialized : true,
    cookie : ({secure : false}),
}));

// Parse Form Data
app.use(express.urlencoded({extended : true}));

// View engine
app.set('view engine' , "ejs");
// View path
app.set("views", path.join(path.resolve('src','views')));

// Middleware for the Ejs layout
app.use(ejsLayouts);
app.use(express.static('src/views'));
app.use(express.static('public'));

// UserController ,JobController And RecruiterController Objects
const usersController = new UserController();
const recruitersController = new RecruiterController();
const jobsController = new JobController();

// Home Page 
app.get('/',usersController.getHome);

// Recruiter routes
app.get('/register',recruitersController.getRegister);
app.post('/register',recruitersController.postRegister);
app.get('/login',recruitersController.getLogin);
app.post('/login',recruitersController.postLogin);
app.get('/logout',recruitersController.logout);

// Jobs
app.get('/jobs',jobsController.getJobs);
app.get('/jobs/job-page/:jobId',jobsController.getJobPage);
app.get('/postjob', auth, jobsController.getPostJob);
app.post('/postjob', auth, jobsController.postJobs);
app.get('/updateJob/:jobId',jobsController.getJobUpdate);
app.post('/updateJob/:jobId',jobsController.postJobUpdate);
app.get('/deletejob/:jobId',jobsController.deleteJob);

// Search functionality
app.get('/search',jobsController.getSearchJobs);

// User
app.post('/postApplyJob/:jobId',uploadFile.single('resume'),usersController.postApplyJob);
app.get('/applicant-resume/:applicantEmail/:jobId', usersController.getApplicantResume);
app.get('/applicants/:jobId',auth,usersController.getApplicants);


// Exporting Server
export default app;