## 4. A form that takes input from users

> TODO: we're introducing the message board here

We'll combine our knowledge of templates with HTML forms to create a page with a text box
where the user can enter their name and be shown a greeting.

Activities

1. Write a form that sends the user's name to `/greet`
2. Write a template that renders either a greeting, or a form to take the user's name
3. Handle the form data and render it into the aforementioned template

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
