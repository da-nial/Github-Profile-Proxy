# GitHub Profile Proxy

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This project is a web application that enables users to search for GitHub profiles using usernames. The application retrieves and displays user information, including avatars, names, blog links, locations, bios, and favorite programming languages based on repository languages. It employs local storage for caching data and minimizing API calls.

This project was built with front-end technologies (HTML/CSS and JavaScript) as the midterm exam of Internet Engineering course at Amirkabir University of Technology, Spring 2020.

## How It Works

1. Upon page load, a custom event listener is added to the submit button.
2. When the form is submitted, the `onSubmit` function is called.
3. The entered username is obtained from the input field.
4. The `getUser` function is used to retrieve and render user information.
5. If the information is in local storage, it's rendered directly.
6. If not, the application fetches user data from the GitHub API.
7. The `getUserFavLanguage` function determines the user's favorite programming language.
8. User information is displayed using the `renderUserInfo` function.
9. Notifications are managed using the `renderMessage` and `renderError` functions.

## Demo
![Hello](demo.png)

## Course Information
- **Course**: Internet Engineering
- **University**: Amirkabir University of Technology  
- **Semester**: Spring 2020

Let me know if you have any questions.