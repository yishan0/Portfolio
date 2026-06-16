const output = document.getElementById("output");
const inputLine = document.getElementById("input-line");
const input = document.getElementById("terminal-input");

// Check if terminal elements exist (only on home and projects pages)
if (!output || !inputLine || !input) {
    // Not a terminal page, don't initialize terminal functionality
    console.log("Terminal not found on this page");
} else {
    const responses = {
      help: "Hey, heres what you may want to ask me.\n'about' to see more about who I am.\nclick on the buttons below to navigate to a page you'd like to see\n'clear' to clear everything I've said so far.",
      about: "I'm Yishan Lin, and here you can find some of my projects and skills.",
      projects: "Here you can see some of my projects!",
      clear: "Terminal Cleared. Type 'help' for available commands."
    };

    const projectDetails = {
      "1": {
        name: "Javiolin",
        description: "A Java swing-based violin note and rhythm matching game. This game aims to help new violinists learn note positions on their violin, while providing a fun and rewarding experience. This is the most complex game I have made in terms of technicality, showcasing some of my fundamental coding skills.",
        technologies: "Java, Java Swing",
        linkType: "github",
        link: "https://github.com/yishan0/Javiolin"
      },
      "2": {
        name: "Mission: Waste Handling",
        description: "A game developed with Unity that gamifies recycling and helps players learn what type of bottle waste to recycle.",
        technologies: "Unity, C#, Procreate",
        linkType: "website",
        link: "https://play.unity.com/en/games/15d533fe-0002-481d-a6f6-2d6d56e70e8a/mission-waste-handling-v1"
      },
      "3": {
        name: "Dreamscapes",
        description: "Made as part of the UCI x GATI Game Science and Engineering Technology (GSET) summer program in two weeks, collaboraiting with a group of likeminded engineers and artists. This is a Unity game MVP trailer for Dreamscapes, an escape from reality into a dangerous yet dreamy and surreal world. This demonstrates my originality and aesthetically driven creative work applied to a game design context, in which I designed all visuals and developed the final trailer.",
        technologies: "Unity, C#",
        linkType: "youtube",
        link: "https://www.youtube.com/watch?v=MIu8FfWXQrc"
      },
    };

    let currentProjectView = null; // Track if user is viewing a project

    // Maps similar inputs to base commands
    function matchCommand(input) {
      const text = input.toLowerCase();

      const helpKeywords = ["help", "support", "assist", "what do i do", "help me out", "how to", "how do i"];
      for (let kw of helpKeywords) {
        if (text.includes(kw)) return "help";
      }

      const aboutKeywords = ["about", "who are you", "your story", "background"];
      for (let kw of aboutKeywords) {
        if (text.includes(kw)) return "about";
      }

      const projectsKeywords = ["project", "projects", "portfolio", "work"];
      for (let kw of projectsKeywords) {
        if (text.includes(kw)) return "projects";
      }

      if (text === "clear") return "clear";

      // Check if input is a project number 1, 2, or 3
      if (["1", "2", "3"].includes(text.trim())) return text.trim();

      // Check for view/exit commands when in project view
      if (currentProjectView) {
        if (text === "view" || text.includes("view")) {
          const project = projectDetails[currentProjectView];
          if (project.linkType === "youtube") return "view_youtube";
          if (project.linkType === "website") return "view_website";
          return "view_github";
        }
        if (text === "exit" || text.includes("exit") || text === "back" || text.includes("back")) return "exit_details";
      }

      return null;
    }

    function typeLine(text, callback = () => {}) {
      const pre = document.createElement("pre");
      pre.classList.add("terminal-line");
      pre.textContent = ">> ";

      output.appendChild(pre);

      let i = 0;
      function typeChar() {
        if (i < text.length) {
          const char = text[i];
          if (char === "\n") {
            pre.textContent += "\n>> ";
          } else {
            pre.textContent += char;
          }
          i++;
          setTimeout(typeChar, 5); // Adjust typing speed: lower = faster, higher = slower (milliseconds per character)
        } else {
          callback();
        }
      }
      typeChar();
    }

    function createRedirectButton(text, url, delay = 0) {
      setTimeout(() => {
        const button = document.createElement("div");
        button.className = "redirect-button";
        button.innerHTML = `
          <span class="button-text">${text}</span>
          <i class="fas fa-arrow-right"></i>
        `;
        button.addEventListener('click', () => {
          // Remove button after click to prevent multiple clicks
          button.style.opacity = '0';
          button.style.transform = 'translateX(20px)';
          setTimeout(() => button.remove(), 300);
          window.location.href = url;
        });
        output.appendChild(button);
        
        // Add animation
        button.style.opacity = '0';
        button.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          button.style.opacity = '1';
          button.style.transform = 'translateX(0)';
        }, 100);
      }, delay);
    }

    function createProjectButton(projectNum, projectName, delay = 0) {
      setTimeout(() => {
        const button = document.createElement("div");
        button.className = "project-button";
        button.innerHTML = `
          <span class="button-text">${projectNum}. ${projectName}</span>
          <i class="fas fa-external-link-alt"></i>
        `;
        button.addEventListener('click', () => {
          showProjectDetails(projectNum);
          // Remove all project buttons after selection
          document.querySelectorAll('.project-button').forEach(btn => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            setTimeout(() => btn.remove(), 300);
          });
        });
        output.appendChild(button);
        
        // Add animation
        button.style.opacity = '0';
        button.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
        }, 100);
      }, delay);
    }

    function showProjectDetails(projectNum) {
      const project = projectDetails[projectNum];
      if (!project) return;

      currentProjectView = projectNum; // Set current project view

      // Clear previous content
      output.innerHTML = '';
      
      // Determine button text and icon based on link type
      let buttonText, buttonIcon, linkMessage;
      if (project.linkType === "youtube") {
        buttonText = "Watch on YouTube";
        buttonIcon = "fab fa-youtube";
        linkMessage = "Press on the YouTube button to watch the trailer, type 'exit' to return";
      } else if (project.linkType === "website") {
        buttonText = "Visit Website";
        buttonIcon = "fas fa-globe";
        linkMessage = "Press on the Website button to visit the project, type 'exit' to return";
      } else {
        buttonText = "View on GitHub";
        buttonIcon = "fab fa-github";
        linkMessage = "Press on the GitHub button to redirect to the project repository, type 'exit' to return";
      }
      
      // Show project details with animations
      typeLine(`Project ${projectNum}: ${project.name}`, () => {
        typeLine(`Description: ${project.description}`, () => {
          typeLine(`Technologies: ${project.technologies}`, () => {
            typeLine(`Commands: ${linkMessage}`, () => {
              // Create link button (GitHub, YouTube, or Website)
              setTimeout(() => {
                const linkButton = document.createElement("div");
                linkButton.className = project.linkType === "youtube" ? "youtube-button" : 
                                       project.linkType === "website" ? "website-button" : "github-button";
                linkButton.innerHTML = `
                  <i class="${buttonIcon}"></i>
                  <span class="button-text">${buttonText}</span>
                `;
                linkButton.addEventListener('click', () => {
                  linkButton.style.transform = 'scale(0.8)';
                  setTimeout(() => {
                    window.open(project.link, '_blank');
                  }, 300);
                  linkButton.style.transform = 'scale(1)';
                });
                output.appendChild(linkButton);
                
                // Animate in
                linkButton.style.opacity = '0';
                linkButton.style.transform = 'scale(0.8)';
                setTimeout(() => {
                  linkButton.style.opacity = '1';
                  linkButton.style.transform = 'scale(1)';
                }, 100);
              }, 500);

              // Create exit button
              setTimeout(() => {
                const exitButton = document.createElement("div");
                exitButton.className = "exit-button";
                exitButton.innerHTML = `
                  <i class="fas fa-times"></i>
                  <span class="button-text">Exit Details</span>
                `;
                exitButton.addEventListener('click', () => {
                  exitButton.style.opacity = '0';
                  exitButton.style.transform = 'scale(0.8)';
                  setTimeout(() => {
                    exitButton.remove();
                    exitProjectView();
                  }, 300);
                });
                output.appendChild(exitButton);
                
                // Animate in
                exitButton.style.opacity = '0';
                exitButton.style.transform = 'scale(0.8)';
                setTimeout(() => {
                  exitButton.style.opacity = '1';
                  exitButton.style.transform = 'scale(1)';
                }, 100);
              }, 700);

              // Show input line for terminal commands
              setTimeout(() => {
                inputLine.style.display = "flex";
                input.focus();
              }, 900);
            });
          });
        });
      });
    }

    function exitProjectView() {
      currentProjectView = null; // Clear current project view
      showProjectsPage();
    }

    function showProjectsPage() {
      output.innerHTML = '';
      typeLine("Heres some of my projects - Select a project or type the project number:", () => {
        createProjectButton("1", "Javiolin", 300);
        createProjectButton("2", "Mission: Waste Handling", 500);
        createProjectButton("3", "Dreamscapes", 700);
        setTimeout(() => {
          inputLine.style.display = "flex";
          input.focus();
        }, 900);
      });
    }

    function processCommand(command) {
      const cmd = matchCommand(command);

      if (cmd === "clear") {
        output.innerHTML = "";
        currentProjectView = null; // Reset project view
        typeLine(responses.clear, () => {
          inputLine.style.display = "flex";
          input.focus();
        });
      } else if (cmd === "help") {
        typeLine(responses[cmd], () => {
          // Add redirect buttons for all pages
          createRedirectButton("Go to About Page", "/about", 800);
          createRedirectButton("Go to Projects Page", "/projects", 1000);
          createRedirectButton("Go to Art Portfolio", "/art", 1200);
          createRedirectButton("Go to Contact Page", "/contact", 1400);
          inputLine.style.display = "flex";
          input.focus();
        });
      } else if (cmd === "about") {
        typeLine(responses[cmd], () => {
          createRedirectButton("Go to About Page", "/about", 500);
          inputLine.style.display = "flex";
          input.focus();
        });
      } else if (cmd === "projects") {
        typeLine(responses[cmd], () => {
          createRedirectButton("Go to Projects Page", "/projects", 500);
          inputLine.style.display = "flex";
          input.focus();
        });
      } else if (["1", "2", "3"].includes(cmd)) {
        showProjectDetails(cmd);
      } else if (cmd === "view_github") {
        // Handle view command for GitHub
        if (currentProjectView) {
          const project = projectDetails[currentProjectView];
          typeLine(`Opening GitHub repository for ${project.name}...`, () => {
            setTimeout(() => {
              window.open(project.link, '_blank');
              typeLine("GitHub opened in new tab. You can continue using the terminal.", () => {
                inputLine.style.display = "flex";
                input.focus();
              });
            }, 1000);
          });
        }
      } else if (cmd === "view_youtube") {
        // Handle view command for YouTube
        if (currentProjectView) {
          const project = projectDetails[currentProjectView];
          typeLine(`Opening YouTube video for ${project.name}...`, () => {
            setTimeout(() => {
              window.open(project.link, '_blank');
              typeLine("YouTube opened in new tab. You can continue using the terminal.", () => {
                inputLine.style.display = "flex";
                input.focus();
              });
            }, 1000);
          });
        }
      } else if (cmd === "view_website") {
        // Handle view command for Website
        if (currentProjectView) {
          const project = projectDetails[currentProjectView];
          typeLine(`Opening website for ${project.name}...`, () => {
            setTimeout(() => {
              window.open(project.link, '_blank');
              typeLine("Website opened in new tab. You can continue using the terminal.", () => {
                inputLine.style.display = "flex";
                input.focus();
              });
            }, 1000);
          });
        }
      } else if (cmd === "exit_details") {
        // Handle exit command
        typeLine("Returning to project selection...", () => {
          setTimeout(() => {
            exitProjectView();
          }, 1000);
        });
      } else {
        typeLine("Unknown command. Try 'help'.", () => {
          inputLine.style.display = "flex";
          input.focus();
        });
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = input.value.trim();
        if (command === "") return;
        input.value = "";
        inputLine.style.display = "none";
        processCommand(command);
      }
    });

    // Highlight active page in navbar
    function highlightActivePage() {
      const currentPath = window.location.pathname;
      const navItems = document.querySelectorAll('.nav-item');
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPath) {
          item.classList.add('active');
        }
      });
    }

    // Show page-specific content based on current page
    function showPageContent() {
      const currentPath = window.location.pathname;
      
      if (currentPath === '/') {
        // Home page
        typeLine("Hello, welcome to my portfolio. I am Yishan Lin. Here, you can get to know more about me! Type 'help' to begin.", () => {
          inputLine.style.display = "flex";
          input.focus();
        });
      } else if (currentPath === '/projects') {
        // Projects page - show project selection
        showProjectsPage();
      }
    }

    // Call on page load
    window.addEventListener('DOMContentLoaded', () => {
      highlightActivePage();
      showPageContent();
    });

    document.addEventListener("click", () => {
      input.focus();
    });
}

// Highlight active page in navbar (works on all pages)
function highlightActivePage() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === currentPath) {
      item.classList.add('active');
    }
  });
}

// Call on page load for navbar highlighting
window.addEventListener('DOMContentLoaded', () => {
  highlightActivePage();
});