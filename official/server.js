/* server.js
* Honeyscape
*"Defined routes http endpoints"
*By:Zach Banducci, Tyrone Criddle, Fernando Corral
*/
const Hapi = require('hapi');
const server = new Hapi.Server();
const account_handler = require('./account/handlers');
const job_handler = require('./jobs/handlers');
const review_handler = require('./reviews/handlers');
const supply_handler = require('./supplies/handlers');
const supplier_handler = require('./suppliers/handlers');
const task_handler = require('./tasks/handlers');
const cookie = require('hapi-auth-cookie');
const query = require('./query');

server.connection({ port: 5000, host: "0.0.0.0",
	routes: {
		cors: {
			origin: ["*"],
			headers: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers","Content-Type"],
			credentials: true
			// additionalHeaders: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers",
			// "Content-Type", "Accept-Language"],
			// additionalExposedHeaders: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers",
			// "Content-Type", "Origin", "Accept-Language"]
		}
	},
});

const scheme = function (server, options) {
	return {
		authenticate: function (request, h) {

			const authorization = request.headers.authorization;
			if (!authorization) {
				throw Boom.unauthorized(null, 'Custom');
			}
			return h.authenticated({ credentials: { user: 'john' } });
		}
	};
};

server.auth.scheme('cookie', scheme)

// server.auth.default('session');

server.auth.strategy('session', 'cookie', {
	password: 'oatmeal-raisin',
	cookie: 'chocolate-chip'
})

server.route({
	method: "GET",
	path: '/login',
	handler: function(request, reply, err) {
		if(err) throw err;
		return reply("Login page").code(200);
	}
});


server.route({
	method: 'PUT',
	path: '/login',
	handler: account_handler.login
});

server.route({
	method: 'GET',
	path: '/logout',
	handler: function(request, reply) {
		return reply("logout page").code(200);
	}
});

server.route({
	method: "GET",
	path: "/signup",
	handler: function(request, reply, err) {
		if (err) throw err;
		return reply("Signup page").code(200);
	}
});

server.route({
	method: "POST",
	path: "/signup",
	handler: account_handler.register
});

server.route({
	method: "POST",
	path: "/account",
	handler: account_handler.edit
})
server.route({
	method: "DELETE",
	path: '/account',
	handler: account_handler.remove
});

server.route({
	method: "POST",
	path: '/changepassword',
	handler: account_handler.changePassword
});

// Suppliers + Reviews

server.route({
	method: "GET",
	path: "/suppliers/{supplier_id?}",
	handler: supplier_handler.view
});

server.route({
	method: "GET",
	path: "/suppliers/supply/{supply_name}",
	handler: supplier_handler.viewAllSuppliersName
});

server.route({
	method: "GET",
	path: "/suppliers/supplyID/{supply_id}",
	handler: supplier_handler.viewAllSuppliersID
});

server.route({
	method: "GET",
	path: '/suppliers/{supplier_id}/reviews',
	handler: review_handler.retrieveAll
});

server.route({
	method: "PUT",
	path: '/suppliers/{supplier_id}/reviews',
	handler: review_handler.publish
});

server.route({
	method: "POST",
	path: "/suppliers/addsupplies",
	handler: supply_handler.create
})

server.route({
	method: "DELETE",
	path: '/suppliers/remove',
	handler: supply_handler.remove
})

server.route({
	method: "POST",
	path: "/suppliers/edit",
	handler: supply_handler.editPrice
})

server.route({
	method: "DELETE",
	path: '/suppliers/{supplier_id}/reviews',
	handler: review_handler.remove
});

//Reviews - Dispute

server.route({
	method: "PUT",
	path: '/suppliers/{supplier_id}/dispute',
	handler: function() {
		console.log('do something');
	}
});

server.route({
	method: "GET",
	path: '/suppliers/{supplier_id}/supplies',
	handler: supply_handler.view
});

// Jobs

server.route({
	method: "POST",
	path: '/jobs/create/{id}',
	handler: job_handler.create
});

server.route({
	method: "PUT",
	path: '/jobs/{job_id}',
	handler: job_handler.editJob
});

server.route({
	method: 'GET',
	path: '/jobs/{id}',
	handler: job_handler.retrieveAll
});

server.route({
	method: "DELETE",
	path: '/jobs/{job_id}',
	handler: job_handler.remove
});

server.route({
	method: "GET",
	path: '/supplies',
	handler: supply_handler.retrieveTypes
});

// Task manager for jobs

server.route({
	method: "GET",
	path: '/jobs/{job_id}/tasks',
	handler: task_handler.retrieve
});

server.route({
	method: "POST",
	path: '/tasks/{account_id}',
	handler: task_handler.create
});

server.route({
	method: "PUT",
	path: '/tasks/{task_id}',
	handler: task_handler.edit
});

server.route({
	method: "DELETE",
	path: '/jobs/{job_id}/tasks',
	handler: task_handler.remove
});

server.route({
	method: "PATCH",
	path: "/jobs/{job_id}/tasks",
	handler: task_handler.complete
});

server.route({
	method: "POST",
	path: '/jobs/{job_id}/addsupplies',
	handler: supply_handler.addToJob
});

server.route({
	method: "GET",
	path: '/userpage/{id}',
	handler: account_handler.retrieve
});

server.start(err => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
