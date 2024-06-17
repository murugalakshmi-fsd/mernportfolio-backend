import { Router } from 'express';
import Portfolio from '../modules/portfoliomodule.mjs';
import authMiddleware from '../middleware/authmiddleware.mjs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

const router = Router();

// Fetch portfolio data
router.get('/', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id }).populate('user');
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Intro
router.post('/update-intro', authMiddleware, async (req, res) => {
  try {
    const { _id, ...introData } = req.body;
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $set: { intro: introData } },
      { new: true }
    );
    res.status(200).json({ portfolio: updatedPortfolio });
  } catch (error) {
    console.error('Error updating intro:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update About
router.post('/update-about', authMiddleware, async (req, res) => {
  try {
    const { _id, ...aboutData } = req.body;
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $set: { about: aboutData } },
      { new: true }
    );
    res.status(200).json({ portfolio: updatedPortfolio });
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Experience
router.post('/add-experience', authMiddleware, async (req, res) => {
  try {
    const newExperience = req.body;
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $push: { experiences: newExperience } },
      { new: true }
    );
    res.status(200).json({ portfolio: updatedPortfolio });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Experience
router.post('/update-experience/:expId', authMiddleware, async (req, res) => {
  try {
    const { expId } = req.params;
    const { _id, ...updatedExperience } = req.body;
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const experienceIndex = portfolio.experiences.findIndex(exp => exp._id == expId);
    if (experienceIndex === -1) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    portfolio.experiences[experienceIndex] = updatedExperience;
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Experience
router.delete('/delete-experience/:expId', authMiddleware, async (req, res) => {
  try {
    const { expId } = req.params;
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    portfolio.experiences = portfolio.experiences.filter(exp => exp._id != expId);
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Project
router.post('/add-project', authMiddleware, async (req, res) => {
  try {
    const newProject = req.body;
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $push: { projects: newProject } },
      { new: true }
    );
    res.status(200).json({ portfolio: updatedPortfolio });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Project
router.post('/update-project/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { _id, ...updatedProject } = req.body;
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const projectIndex = portfolio.projects.findIndex(proj => proj._id == projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    portfolio.projects[projectIndex] = updatedProject;
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Project
router.delete('/delete-project/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    portfolio.projects = portfolio.projects.filter(proj => proj._id != projectId);
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Course
router.post('/add-course', authMiddleware, async (req, res) => {
  try {
    const newCourse = req.body;
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $push: { courses: newCourse } },
      { new: true }
    );
    res.status(200).json({ portfolio: updatedPortfolio });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Course
router.post('/update-course/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { _id, ...updatedCourse } = req.body;
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    const courseIndex = portfolio.courses.findIndex(course => course._id == courseId);
    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }
    portfolio.courses[courseIndex] = updatedCourse;
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Course
router.delete('/delete-course/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    portfolio.courses = portfolio.courses.filter(course => course._id != courseId);
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Contact
router.post('/update-contact', authMiddleware, async (req, res) => {
  try {
    const { _id, ...contactData } = req.body;
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $set: { contact: contactData } },
      { new: true }
    );
    res.status(200).json({ portfolio: updatedPortfolio });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/export-pdf', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id }).populate('user');
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    // Set page size and fonts
    page.setSize([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add portfolio data to PDF
    page.drawText(`Welcome ${portfolio.intro.firstName} ${portfolio.intro.lastName}`, {
      x: 50,
      y: 700,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`About Me:`, {
      x: 50,
      y: 670,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Skills: ${portfolio.about.skills.join(', ')}`, {
      x: 70,
      y: 640,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // Add more sections as needed (experiences, projects, courses, contact)

    // Serialize PDF to a buffer and send it as a response
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio.pdf');
    res.send(pdfBytes);
  } catch (error) {
    console.error('Error exporting portfolio as PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
