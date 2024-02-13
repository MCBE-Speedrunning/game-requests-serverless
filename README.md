# Game-Requests

Game-Requests is the site that is hosted on
[form.mcbe.wtf](https://form.mcbe.wtf/).

The main features are:

1. Get game, map, and server requests from interested runners
2. Post the request on a discord channel

This is achieved through basic a tailwind form design and a webhook.

To prevent spam a captcha has been added, where the user has to type in the
letters and numbers shown in a picture in order to post the submission,
otherwise the submission goes nowhere.

The app is mainly hosted on [Deno Deploy](https://deno.com/deploy), but is meant
to be easily ran on any other infrastructure that runs deno.

## Configuration

There are 4 environmental variables that the program takes, 3 of which are
discord webhook links, and a forth optional captcha prefix which is used in the
hashing of the captcha.

All values are meant to be private

Under development a `.env` file can be created containing the following entries:

```sh
BEDROCK="https://discord.com/api/webhooks/"
OTHER="https://discord.com/api/webhooks/"
JAVA="https://discord.com/api/webhooks/"
CAPTCHA_PREFIX="captcha-cookie-prefix"
```

Replace as needed.

## Historical

This is a re-write of
[the node written version](https://github.com/MCBE-Speedrunning/Game-Requests).
