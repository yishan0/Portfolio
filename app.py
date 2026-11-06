from flask import Flask, redirect

# The live site is the static minimalist portfolio in site/.
# The old terminal-style site is kept in archive/terminal-site/ and is not served.
app = Flask(__name__, static_folder='site', static_url_path='')

@app.route('/')
def home():
    return app.send_static_file('index.html')

# Old page URLs now point at the matching section of the new single-page site.
OLD_ROUTES = {
    '/about': 'about',
    '/projects': 'projects',
    '/art': 'all-artwork',
    '/contact': 'contact',
    '/research': '',
}

def make_redirect(section):
    return lambda: redirect('/#' + section if section else '/')

for path, section in OLD_ROUTES.items():
    app.add_url_rule(path, endpoint='old' + path.replace('/', '_'), view_func=make_redirect(section))

if __name__ == '__main__':
    app.run(debug=True)
