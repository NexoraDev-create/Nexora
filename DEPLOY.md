# Publishing Nexora

The site is a static HTML/CSS/JS project. No build step or paid hosting is required.

## GitHub Pages deployment

1. Create a GitHub repository named `nexora` and make it public (GitHub Pages on the free plan requires a public repository).
2. From the project directory, connect the repository and push the `main` branch:

   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nexora.git
   git push -u origin main
   ```

3. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
4. The included workflow validates the site and deploys it automatically on every push to `main`.
5. The public address will be `https://YOUR-USERNAME.github.io/nexora/`.

## Before the first public release

- Review the About and Privacy pages. The Privacy page is explicitly a draft; replace it with a policy that accurately describes the live host and any enabled services.
- Establish a public contact method that is safe and appropriate to publish.
- Review all article claims and add reliable primary references for changing software details.
- Test the deployed pages on a phone and desktop.
- If a custom domain is purchased later, configure it in GitHub Pages and then add absolute canonical URLs and a sitemap using that exact domain. Do not publish placeholder canonical URLs.
- Keep analytics, advertising, forms, and newsletter collection disabled until their privacy disclosures and consent requirements have been handled.

## Account and payment note

A free static hosting account can publish the site, but monetization services and payment accounts have separate eligibility and legal requirements. A parent or guardian must handle any service that requires an adult account holder.
