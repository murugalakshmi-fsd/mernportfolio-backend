import { Router } from 'express';
import Portfolio from '../modules/portfoliomodule.mjs';
import authMiddleware from '../middleware/authmiddleware.mjs';
//import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit'

const router = Router();

// Fetch portfolio data
router.get('/',authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.users._id }).populate('user');
    
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
    console.log('Authenticated users:', req.users);
    console.log('Authenticated users ID:', req.users ? req.users._id : 'undefined');
    let portfolio = await Portfolio.findOne({ user: req.users._id });
     console.log("portfolio",portfolio)
    if (portfolio==null) {
      // If portfolio doesn't exist, create a new one
      portfolio = new Portfolio({
        user: req.users._id,
        intro: introData,

      });
    } else {
      // Portfolio exists, update the intro data
      portfolio.intro = introData;
    }

    const updatedPortfolio = await portfolio.save();
    res.status(200).json({ success: true, portfolio: updatedPortfolio, message: 'Intro updated successfully' });
  } catch (error) {
    console.error('Error updating intro:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: 'An error occurred while updating the intro' });
  }
});

// Update About
router.post('/update-about', authMiddleware, async (req, res) => {
  try {
    const { _id, ...aboutData } = req.body;
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      // If portfolio doesn't exist, create a new one with the aboutData
      portfolio = new Portfolio.create({
        user: req.users._id,
        about: aboutData,
      });
    } else {
      // Portfolio exists, update the about data
      portfolio.about = aboutData;
    }

    const updatedPortfolio = await portfolio.save();
    res.status(200).json({ success: true, portfolio: updatedPortfolio, message: 'About section updated successfully' });
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: 'An error occurred while updating the about section' });
  }
});

//addexperience
router.post('/add-experience', authMiddleware, async (req, res) => {
  try {
    const newExperience = req.body;
    console.log("Adding new experience:", newExperience);
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      // If portfolio doesn't exist, create a new one
      portfolio = new Portfolio.create({
        user: req.users._id,
        experiences: [newExperience],
        // Add other initial fields as needed
      });
    } else {
      // Portfolio exists, push new experience to experiences array
      portfolio.experiences.push(newExperience);
    }

    const updatedPortfolio = await portfolio.save();
    res.status(200).json({ success: true, portfolio: updatedPortfolio, message: "Experience added successfully" });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update Experience
router.post('/update-experience/:expId', authMiddleware, async (req, res) => {
  try {
    // Remove extra colon from expId
    const expId = req.params.expId.replace(':', '');
    const { _id, ...updatedExperience } = req.body;
    console.log("Updating experience with ID:", expId);
    console.log("Updated experience data:", updatedExperience);
    
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    // Convert expId to string for comparison
    const experienceIndex = portfolio.experiences.findIndex(exp => exp._id.toString() === expId);

    if (experienceIndex === -1) {
      console.log("Experience not found in portfolio:", expId);
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    
    portfolio.experiences[experienceIndex] = updatedExperience;
    await portfolio.save();
    
    console.log("Experience updated successfully:", expId);
    res.status(200).json({ success: true, portfolio, message: "Experience updated successfully" });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



// Delete Experience
router.delete('/delete-experience/:expId', authMiddleware, async (req, res) => {
  try {
    const { expId } = req.params;
    console.log("Deleting experience:", expId);
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    portfolio.experiences = portfolio.experiences.filter(exp => exp._id != expId);
    await portfolio.save();
    res.status(200).json({ success: true, portfolio, message: "Experience deleted successfully" });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Add Project
router.post('/add-project', authMiddleware, async (req, res) => {
  try {
    const newProject= req.body;
    console.log("Adding new project:", newProject);
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      // If portfolio doesn't exist, create a new one
      portfolio = new Portfolio({
        user: req.users._id,
        projects: [newProject],
        // Add other initial fields as needed
      });
    } else {
      // Portfolio exists, push new experience to experiences array
      portfolio.projects.push(newProject);
    }

    const updatedPortfolio = await portfolio.save();
    res.status(200).json({ success: true, portfolio: updatedPortfolio, message: "Project added successfully" });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update Project

router.post('/update-project/:proId', authMiddleware, async (req, res) => {
  try {
    // Remove extra colon from expId
    const proId = req.params.proId.replace(':', '');
    const { _id, ...updatedProject } = req.body;
    console.log("Updating Project with ID:", proId);
    console.log("Updated Project data:", updatedProject);
    
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    // Convert expId to string for comparison
    const projectIndex = portfolio.projects.findIndex(pro => pro._id.toString() === proId);

    if (projectIndex === -1) {
      console.log("Experience not found in portfolio:", proId);
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    
    portfolio.projects[projectIndex] = updatedProject;
    await portfolio.save();
    
    console.log("Experience updated successfully:", proId);
    res.status(200).json({ success: true, portfolio, message: "Experience updated successfully" });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



// Delete Project
router.delete('/delete-project/:proId', authMiddleware, async (req, res) => {
  try {
    const { proId } = req.params;
    console.log("Deleting project:", proId);
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    portfolio.projects = portfolio.projects.filter(pro=> pro._id != proId);
    await portfolio.save();
    res.status(200).json({ success: true, portfolio, message: "Experience deleted successfully" });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Add Course
router.post('/add-course', authMiddleware, async (req, res) => {
  try {
    const newCourse = req.body;
    console.log("Adding new course:", newCourse);
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      // If portfolio doesn't exist, create a new one
      portfolio = new Portfolio({
        user: req.users._id,
        courses: [newCourse],
        // Add other initial fields as needed
      });
    } else {
      
      portfolio.courses.push(newCourse);
    }

    const updatedPortfolio = await portfolio.save();
    res.status(200).json({ success: true, portfolio: updatedPortfolio, message: "Course added successfully" });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update Course
router.post('/update-course/:couId', authMiddleware, async (req, res) => {
  try {
    // Remove extra colon from expId
    const couId = req.params.couId.replace(':', '');
    const { _id, ...updatedCourse } = req.body;
    console.log("Updating experience with ID:", couId);
    console.log("Updated experience data:", updatedCourse);
    
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    // Convert expId to string for comparison
    const courseIndex = portfolio.courses.findIndex(cou => cou._id.toString() === couId);

    if (courseIndex === -1) {
      console.log("Course not found in portfolio:", couId);
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    
    portfolio.courses[courseIndex] = updatedCourse;
    await portfolio.save();
    
    console.log("Course updated successfully:", couId);
    res.status(200).json({ success: true, portfolio, message: "Course updated successfully" });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



// Delete Course
router.delete('/delete-course/:couId', authMiddleware, async (req, res) => {
  try {
    const { couId } = req.params;
    console.log("Deleting course:", couId);
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    portfolio.courses = portfolio.courses.filter(cou => cou._id != couId);
    await portfolio.save();
    res.status(200).json({ success: true, portfolio, message: "Course deleted successfully" });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Update Contact
router.post('/update-contact', authMiddleware, async (req, res) => {
  try {
    const { _id, ...contactData } = req.body;
    let portfolio = await Portfolio.findOne({ user: req.users._id });

    if (!portfolio) {
      // If portfolio doesn't exist, create a new one
      portfolio = new Portfolio({
        user: req.users._id,
        contact: contactData,
      });
    } else {
      // Portfolio exists, update the intro data
      portfolio.contact = contactData;
    }

    const updatedPortfolio = await portfolio.save();
    res.status(200).json({ success: true, portfolio: updatedPortfolio, message: 'contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: 'An error occurred while updating the intro' });
  }
});


// // Fetch portfolio data
// router.get('/export-pdf', authMiddleware, async (req, res) => {
//   try {
//     // Fetch portfolio data for the authenticated users
//     const portfolio = await Portfolio.findOne({ user: req.users._id }).populate('user');
    
//     if (!portfolio) {
//       return res.status(404).json({ message: 'Portfolio not found' });
//     }

//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();

//     // Set page size and fonts
//     page.setSize([600, 800]);
//     const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     // Add intro section
//     page.drawText(`Welcome ${portfolio.intro.firstName} ${portfolio.intro.lastName}`, {
//       x: 50,
//       y: 700,
//       size: 24,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // Add about section
//     page.drawText(`About Me:`, {
//       x: 50,
//       y: 670,
//       size: 18,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // Add skills
//     page.drawText(`Skills: ${portfolio.about.skills.join(', ')}`, {
//       x: 70,
//       y: 640,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // Add experiences section
//     page.drawText(`Experiences:`, {
//       x: 50,
//       y: 610,
//       size: 18,
//       font,
//       color: rgb(0, 0, 0),
//     });
    
//     let yOffset = 590;
//     portfolio.experiences.forEach((experience, index) => {
//       page.drawText(`${index + 1}. ${experience.title} at ${experience.company}`, {
//         x: 70,
//         y: yOffset,
//         size: 12,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       yOffset -= 20;
//     });

//     // Add projects section
//     page.drawText(`Projects:`, {
//       x: 50,
//       y: yOffset,
//       size: 18,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     yOffset -= 20;
//     portfolio.projects.forEach((project, index) => {
//       page.drawText(`${index + 1}. ${project.title}`, {
//         x: 70,
//         y: yOffset,
//         size: 12,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       yOffset -= 20;
//     });

//     // Add courses section
//     page.drawText(`Courses:`, {
//       x: 50,
//       y: yOffset,
//       size: 18,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     yOffset -= 20;
//     portfolio.courses.forEach((course, index) => {
//       page.drawText(`${index + 1}. ${course.title}`, {
//         x: 70,
//         y: yOffset,
//         size: 12,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       yOffset -= 20;
//     });

//     // Add contact section
//     page.drawText(`Contact:`, {
//       x: 50,
//       y: yOffset,
//       size: 18,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     yOffset -= 20;
//     page.drawText(`Email: ${portfolio.contact.email}`, {
//       x: 70,
//       y: yOffset,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });

//        // Serialize PDF to a buffer and send it as a response
//     const pdfBytes = await pdfDoc.save();
//     // Write the PDF to the filesystem for debugging purposes
//     const filePath = path.join(__dirname, 'portfolio.pdf');
//     fs.writeFileSync(filePath, pdfBytes);

//     // Log the path of the generated PDF file
//     console.log('PDF saved to:', filePath);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=portfolio.pdf');
//     res.send(Buffer.from(pdfBytes));
//   } catch (error) {
//     console.error('Error exporting portfolio as PDF:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
router.get('/export-pdf', authMiddleware, async (req, res) => {
  try {
    // Fetch portfolio data for the authenticated user
    const portfolio = await Portfolio.findOne({ user: req.users._id }).populate('user');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Configure response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio.pdf');

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add intro section
    doc.font('Helvetica-Bold')
      .fontSize(24)
      .text(`Welcome ${portfolio.intro.firstName} ${portfolio.intro.lastName}`, { align: 'center' })
      .moveDown(1.5);

    // Add about section
    doc.fontSize(18)
      .text('About Me:', { underline: true })
      .moveDown(0.5);

    doc.fontSize(12)
      .text(`Skills: ${portfolio.about.skills.join(', ')}`)
      .moveDown(1.5);

    // Add experiences section
    doc.fontSize(18)
      .text('Experiences:', { underline: true })
      .moveDown(0.5);

    portfolio.experiences.forEach((experience, index) => {
      doc.fontSize(12)
        .text(`${index + 1}. ${experience.title} at ${experience.company}`)
        .moveDown(0.5);
    });

    doc.moveDown(1.5);

    // Add projects section
    doc.fontSize(18)
      .text('Projects:', { underline: true })
      .moveDown(0.5);

    portfolio.projects.forEach((project, index) => {
      doc.fontSize(12)
        .text(`${index + 1}. ${project.title}`)
        .moveDown(0.5);
    });

    doc.moveDown(1.5);

    // Add courses section
    doc.fontSize(18)
      .text('Courses:', { underline: true })
      .moveDown(0.5);

    portfolio.courses.forEach((course, index) => {
      doc.fontSize(12)
        .text(`${index + 1}. ${course.title}`)
        .moveDown(0.5);
    });

    doc.moveDown(1.5);

    // Add contact section
    doc.fontSize(18)
      .text('Contact:', { underline: true })
      .moveDown(0.5);

    doc.fontSize(12)
      .text(`Email: ${portfolio.contact.email}`)
      .moveDown(1.5);

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Error exporting portfolio as PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
