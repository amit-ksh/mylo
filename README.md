# Mylo App

**Mylo is an AI-powered web application that provides newsletter service to individuals and businesses to start their newsletter for their users or customers.**

### Tech Stack Used

- [Next.js](https://nextjs.org)
- [Nylas](https://www.nylas.com/)
- [MS Azure Translate](https://learn.microsoft.com/en-us/azure/ai-services/translator/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)

## Setting the local environment

1. Clone the repo and install the dependencies

   ```bash
   git clone https://github.com/amit-ksh/mylo.git
   cd mylo
   ```

1. Rename the `.env.example` to `.env` and fill up all the variables

1. Getting all the credentials (_Follow the guide_)

   - Github: [Guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
   - Google: [Guide](https://support.google.com/cloud/answer/6158849?hl=en)
     1. Once you created the credentials for your GCP app then, add the following:
        - Authorised JavaScript origins (Add URI): http://localhost:3000
        - Authorised redirect URIs (Add URI):
          - http://localhost:3000/api/oauth/connect/
          - http://localhost:3000/api/auth/callback/google
   - Azure AI: [Guide](https://learn.microsoft.com/en-us/azure/ai-services/translator/translator-text-apis?tabs=nodejs)
   - Nylas:
     1. Quickstart: [Guide](https://developer.nylas.com/docs/the-basics/quickstart/#step-2-run-the-sample-api-request)
     1. Now, go to `App Settings` and add the following http://localhost:3000/api/oauth/connect/ in the **Callback URI.**.

1. Installing dependencies and creating DB tables:
   ```base
   npm install (this will both install dependencies and create tables)
   or
   npx prisma migrate dev [If tables are not created, run this]
   ```

1. Run the development server:

   ```bash
   npm run dev
   ```
