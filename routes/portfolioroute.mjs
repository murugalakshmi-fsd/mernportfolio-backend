import { Router } from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import {
  Intro,
  About,
  Project,
  Contact,
  Experience,
  Course,
} from "../modules/portfoliomodule.mjs";
import authMiddleware from "../middleware/authmiddleware.mjs";

const router = Router();
import { User } from "../modules/adminmodule.mjs";
//get all portfolio data
router.get("/",authMiddleware,async (req, res) => {
  try {
    const intros = await Intro.find();
    const abouts = await About.find();
    const projects = await Project.find();
    const experiences = await Experience.find();
    const courses = await Course.find();
    const contact = await Contact.find();

    res.status(200).send({
      intros: intros[0],
      abouts: abouts[0],
      projects: projects,
      experiences: experiences,
      courses: courses,
      contacts: contact[0],
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//update Intro
router.post("/update-intro",authMiddleware,async (req, res) => {
  try {
    const intro = await Intro.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: intro,
      success: true,
      message: "Intro Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//update About
router.post("/update-about",authMiddleware,async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: about,
      success: true,
      message: "About Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//add experience
router.post("/add-experience",authMiddleware,async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(200).send({
      data: experience,
      success: true,
      message: "Experience added successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//update experience
router.post("/update-experience",authMiddleware,async (req, res) => {
  try {
    const experience = await Experience.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: experience,
      success: true,
      message: "Experience updated successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete experience
router.post("/delete-experience",authMiddleware,async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({ _id: req.body._id });
    res.status(200).send({
      data: experience,
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//add project
router.post("/add-project",authMiddleware,async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(200).send({
      data: project,
      success: true,
      message: "Project added successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//update project
router.post("/update-project",authMiddleware,async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: project,
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete project
router.post("/delete-project",authMiddleware,async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.body._id });
    res.status(200).send({
      data: project,
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//add course
router.post("/add-course",authMiddleware,async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(200).send({
      data: course,
      success: true,
      message: "Course added successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//update course
router.post("/update-course",authMiddleware,async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: course,
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete course
router.post("/delete-course",authMiddleware,async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.body._id });
    res.status(200).send({
      data: course,
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//update-contact
router.post("/update-contact",authMiddleware,async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: contact,
      success: true,
      message: "Contact Updated Successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get("/export-pdf",authMiddleware,async (req, res) => {
  try {
   // Fetch data from the database
   const intros = await Intro.find().lean();
   const abouts = await About.find().lean();
   const experiences = await Experience.find().lean();
   const projects = await Project.find().lean();
   const courses = await Course.find().lean();
   const contacts = await Contact.find().lean();

   // Create a new PDF document
   const doc = new PDFDocument();
   doc.pipe(fs.createWriteStream("portfolio.pdf")); // Save the PDF to a file

   // Populate the PDF document with data
   doc.fontSize(16).text("Portfolio Export", { align: "center" });
   doc.moveDown();

   // Add Introduction section
   doc.fontSize(12).text("Introduction:", { underline: true });
   intros.forEach((intro) => {
     doc.text(`Welcome Text: ${intro.welcomeText}`);
     doc.text(`First Name: ${intro.firstName}`);
     doc.text(`Last Name: ${intro.lastName}`);
     doc.text(`Caption: ${intro.caption}`);
     doc.text(`Description: ${intro.description}`);
     doc.moveDown();
   });

   // Add About section
   doc.fontSize(12).text("About:", { underline: true });
   abouts.forEach((about) => {
     doc.text(`Description 1: ${about.description1}`);
     doc.text(`Description 2: ${about.description2}`);
     doc.text("Skills:");
     about.skills.forEach((skill) => doc.text(`- ${skill}`));
     doc.moveDown();
   });

   // Add Experiences section
   doc.fontSize(12).text("Experiences:", { underline: true });
   experiences.forEach((experience, index) => {
     doc.text(`Experience ${index + 1}:`);
     doc.text(`Title: ${experience.title}`);
     doc.text(`Period: ${experience.period}`);
     doc.text(`Company: ${experience.company}`);
     doc.text(`Description: ${experience.description}`);
     doc.moveDown();
   });

   // Add Projects section
   doc.fontSize(12).text("Projects:", { underline: true });
   projects.forEach((project, index) => {
     doc.text(`Project ${index + 1}:`);
     doc.text(`Title: ${project.title}`);
     doc.text(`Description: ${project.description}`);
     doc.text(`Link: ${project.link}`);
     doc.text("Technologies:");
     project.technologies.forEach((tech) => doc.text(`- ${tech}`));
     doc.moveDown();
   });

   // Add Courses section
   doc.fontSize(12).text("Courses:", { underline: true });
   courses.forEach((course, index) => {
     doc.text(`Course ${index + 1}:`);
     doc.text(`Title: ${course.title}`);
     doc.text(`Description: ${course.description}`);
     doc.text(`Link: ${course.link}`);
     doc.moveDown();
   });

   // Add Contact section
   doc.fontSize(12).text("Contact:", { underline: true });
   contacts.forEach((contact) => {
     doc.text(`Name: ${contact.name}`);
     doc.text(`Gender: ${contact.gender}`);
     doc.text(`Email: ${contact.email}`);
     doc.text(`Mobile: ${contact.mobile}`);
     doc.text(`Age: ${contact.age}`);
     doc.text(`Address: ${contact.address}`);
     doc.moveDown();
   });

   // Finalize the PDF document
   doc.end();

   // Send PDF file to client
   res.status(200).download("portfolio.pdf");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    res.status(500).json({ error: "An error occurred while exporting PDF" });
  }
});

export default router;

