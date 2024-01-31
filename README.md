


## Introduction

- This is a Next.js application for building the Emeritus Microsites bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- The content for these landing pages will be powered through Contentful

## Folder Structure

Folder structure is very key for any new application. 

We have divided the folders based on how landing pages are visually organized

 - Layouts - Defines the layout of the pages
 - Sections - A page can have multiple sections like header section, foooter section, banner section, testimony section etc. Section is basically a collection of modules
 - Modules - A module is a collection of components that represents the part of a section like Facutly card in a faculties section. Module is based on components
 - Components - Components are the basic building blocks of the pages. example button, text box, links are considered to be components

![image](https://user-images.githubusercontent.com/103004038/168003336-d53ece42-8e48-4409-90de-c02da131c6fa.png)



## Getting Started

### Install Node
- Use nvm to install version of node mentioned in `.nvmrc file`. 
- If you don't have nvm follow the link to get it installed https://github.com/nvm-sh/nvm
- Once nvm is installed do

```base
nvm use
```

### Install Yarn

```bash
npm install yarn
```

### Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Start with Nginx (Mac)

Install Nginx:
```bash
brew install nginx
```

If you want to test a subdomain (eg: `wsj.partner.emeritusdev.com`), add the following line to `/etc/hosts` using sudo:
```bash
127.0.0.1       localhost       wsj.partner.emeritusdev.com 
```
You can add as many subdomains as you want by adding more lines to `/etc/hosts`.

Start the server with:
```bash
yarn dev-nginx
```

If you get a permissions error from the command try to give execution permissions to the script with:
```bash
chmod 744 bin/dev-nginx
```

You can access the subdomains you configured from your browser:
```bash
wsj.partner.emeritusdev.com:3000
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
