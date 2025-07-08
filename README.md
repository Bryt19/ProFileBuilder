# ProFileBuilder 📄✨

A modern, professional resume and cover letter builder web application built with vanilla JavaScript, HTML, and CSS. Create stunning, ATS-optimized documents that help you stand out in your job search.

![ProFileBuilder Preview](https://img.shields.io/badge/Status-Live%20Demo-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 🌟 Features

### 📋 Resume Builder

- **5+ Professional Templates** - Classic, Modern, Minimal, Creative designs
- **ATS-Optimized Formatting** - Ensures compatibility with Applicant Tracking Systems
- **Real-time Preview** - See changes instantly as you type
- **Photo Upload Support** - Add professional profile pictures
- **Auto-save Functionality** - Never lose your progress
- **Instant PDF Export** - Download your resume in high quality
- **Multiple Color Schemes** - Blue, Green, Purple, Orange, Red themes
- **Dark/Light Mode** - Choose your preferred theme

### ✉️ Cover Letter Generator

- **Job-Specific Templates** - Tailored content for different positions
- **Editable Live Preview** - WYSIWYG editing experience
- **Professional Formatting** - Clean, readable layouts
- **PDF Download & Copy** - Multiple export options
- **Auto-save Progress** - Your work is always saved
- **Responsive Design** - Works on all devices

### 🎨 Modern UI/UX

- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Dark/Light Theme Toggle** - Persistent theme preference
- **Smooth Animations** - Professional micro-interactions
- **Accessibility Features** - WCAG compliant design
- **Modern Typography** - Inter font family for readability

## 🚀 Live Demo

Visit the live application: [ProFileBuilder Demo](https://your-demo-link.com)

## 📁 Project Structure

```
ProFileBuilder/
├── index.html              # Homepage with modern design
├── builder.html            # Resume builder application
├── cover-letter.html       # Cover letter generator
├── privacy-policy.html     # Privacy policy page
├── terms-of-service.html   # Terms of service page
├── contact.html           # Contact page with form
├── script.js              # Resume builder JavaScript
├── style.css              # Resume builder styles
└── README.md              # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and Custom Properties
- **Vanilla JavaScript** - No frameworks, pure JavaScript functionality
- **html2pdf.js** - PDF generation library
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family
- **LocalStorage** - Client-side data persistence

## ⚡ Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ProFileBuilder.git
   cd ProFileBuilder
   ```

2. **Open in browser**

   ```bash
   # Simply open index.html in your browser
   # Or use a local server for development
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start building!**
   - Click "Build Resume" to create your resume
   - Click "Create Cover Letter" for cover letters
   - All data is saved locally in your browser

## 📖 Usage Guide

### Creating a Resume

1. **Navigate to Resume Builder**

   - Click "Build Resume" from the homepage
   - Or directly open `builder.html`

2. **Choose Template & Theme**

   - Select from 5 professional templates
   - Choose your preferred color scheme
   - Toggle between light and dark modes

3. **Fill in Your Information**

   - **Personal Information**: Name, contact details, photo
   - **Education**: Degrees, institutions, dates
   - **Experience**: Work history with achievements
   - **Skills**: Technical and soft skills
   - **Projects**: Portfolio items and accomplishments
   - **Certifications**: Professional certifications

4. **Preview & Export**
   - Real-time preview as you type
   - Auto-save ensures no data loss
   - Download as PDF when ready

### Creating a Cover Letter

1. **Navigate to Cover Letter Generator**

   - Click "Create Cover Letter" from the homepage
   - Or directly open `cover-letter.html`

2. **Fill in the Form**

   - **Your Information**: Name, email, phone
   - **Job Details**: Recipient, company, job title
   - **Content**: Why you're a good fit, skills, achievements

3. **Generate & Edit**

   - Click "Generate Cover Letter" for AI-assisted content
   - Edit the preview directly for customization
   - Auto-save preserves your changes

4. **Export Options**
   - Copy to clipboard for quick sharing
   - Download as PDF for formal submissions

## 🎯 Key Features Explained

### ATS Optimization

- Clean, simple formatting that ATS systems can read
- Standard section headers (Experience, Education, Skills)
- No complex layouts or graphics that confuse scanners
- Optimized keyword placement and structure

### Local Storage

- All data is stored locally in your browser
- No server-side storage or privacy concerns
- Data persists between browser sessions
- Export PDFs for backup and sharing

### Responsive Design

- Works perfectly on desktop, tablet, and mobile
- Adaptive layouts for different screen sizes
- Touch-friendly interface on mobile devices
- Optimized typography for all devices

## 🔧 Customization

### Adding New Templates

1. Modify the template selection in `builder.html`
2. Add new template styles in `style.css`
3. Update the `applyTemplate()` function in `script.js`

### Changing Color Schemes

1. Edit CSS custom properties in the `:root` selector
2. Add new color schemes to the color picker
3. Update the `applyColorScheme()` function

### Modifying Features

- All JavaScript is well-commented and modular
- CSS uses custom properties for easy theming
- HTML structure is semantic and accessible

## 🌐 Browser Support

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized interface
- Mobile-friendly form inputs
- Optimized for portrait and landscape orientations

## 🔒 Privacy & Security

- **No Data Collection**: All information stays on your device
- **No Tracking**: No analytics or tracking cookies
- **Local Storage**: Data saved only in your browser
- **No Server Communication**: Works entirely offline

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and formatting
- Add comments for complex functionality
- Test on multiple browsers and devices
- Ensure accessibility compliance
- Update documentation for new features

## 🐛 Bug Reports

If you find a bug, please report it:

1. Check if the issue has already been reported
2. Provide detailed steps to reproduce
3. Include browser and device information
4. Add screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Font Awesome** for the beautiful icons
- **Google Fonts** for the Inter font family
- **html2pdf.js** for PDF generation capabilities
- **CSS Grid & Flexbox** for modern layouts
- **LocalStorage API** for data persistence

## 📞 Support

- **Email**: support@profilebuilder.com
- **Contact Form**: [Contact Us](contact.html)
- **Documentation**: This README file
- **Issues**: GitHub Issues page

## 🚀 Roadmap

### Planned Features

- [ ] More resume templates
- [ ] Cover letter templates
- [ ] Resume scoring and suggestions
- [ ] LinkedIn profile import
- [ ] Job description parser
- [ ] Resume analytics
- [ ] Multi-language support
- [ ] Cloud storage option

### Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added cover letter generator
- **v1.2.0** - Enhanced UI/UX and animations
- **v1.3.0** - Added privacy policy and terms pages

---

**Made with ❤️ for job seekers worldwide**

_ProFileBuilder - Your professional profile, simplified._
#   P r o F i l e B u i l d e r  
 