
import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required:true,
    unique: true
  },
  intro: {
    welcomeText: {
      type: String,
      default: ''
    },
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    },
  about: {
    lottieUrl: {
      type: String,
      default: ''
    },
   
    description1: {
      type: String,
      default: ''
    },

    skills: {
      type: [String],
      default: ''
    },
  },
  experiences: [{
    title: {
      type: String,
      default: ''
    },
    period: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
  }],
  projects: [{
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    technologies: {
      type: [String],
      default: []
    },
  }],
  courses: [{
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
  }],
  contact: {
    name: {
      type: String,
      default: ''
    },
  
    email: {
      type: String,
      default: ''
    },
    
   
    country: {
      type: String,
      default: '',
    },
  },
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
