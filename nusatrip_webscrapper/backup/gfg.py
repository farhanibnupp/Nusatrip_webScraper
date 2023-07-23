from flask import Flask, redirect, url_for, request, send_file
app = Flask(__name__)


@app.route('/success/<name>')
def success(name):
	return 'welcome %s' % name


@app.route('/login', methods=['POST', 'GET'])
def login():
	if request.method == 'POST':
		return send_file("login.html")
	else:
		return send_file("login.html")


if __name__ == '__main__':
	app.run(debug=True)
