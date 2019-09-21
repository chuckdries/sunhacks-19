## 4. A form that takes input from users

We're going to use forms with our knowledge of templating to create a page where users
can leave messages for each other

Activities

1. Write a route that accepts messages and stores them, we'll call it `/message/`
2. Write a form that sends the user's message to `/message`
3. Write a template that can render our form and messages
4. Write a route that passes all the messages into that template

### A quick primer on HTML forms

HTML has a handful of elements that are interactive. Many of them are variations on
a standard text box and fall under the `input` tag

```HTML
<!-- all of the following render a text box -->
<input type="text" /> <!-- normal text box -->
<input type="password" /> <!-- browsers will show dots instead of letters -->
<input type="email" /> <!-- mobile browsers show a keyboard with an @ symbol on it -->

<!-- other elements -->
<textarea> <!-- resizeable multi-line text input -->
  content inside the textarea by default
</textarea>
<button>
  text inside button
</button>
```

HTML also has an element called `form`, which groups together multiple inputs
and helps us assign functionality to them. Let's jump right into our greeting form

### A form that sends data to our server

Let's see our greeting form in its entirety, then we can break down how it works

```HTML
<form method="GET" action="greet">
  <input type="text" name="name" placeholder="what's your name?">
  <button type="submit">say hello</button>
</form>
```

Our input has a `name` attribute. Every input in a form needs one - it associates
the value of the input with a field on the form.

`form` takes two attributes:

1. `method`: the HTTP method to use to send the request
2. `action`: the path to send the data to

When a form sends a GET request, it sends the data over as a query parameter.
When the user submits this form, it will send a request to
`/greet?name=whateverTheUserTypedInTheNameField` and render whatever we send back.

We don't have anywhere to put that form quite yet

### Adding the form to a template

We're going to put the greet form in our greeting page, so it can ask users for their name
