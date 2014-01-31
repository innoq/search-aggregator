module.exports = {
	adaptors: {
		'./adapter_github_issues': null,

    // Just for testing purposes, does not require inet access
		'./adapter_test_offline': null,

    // Does not work for me without credentials
    /*
		'./adapterBlog': {
			username: 'anon',
			password: 'none',
			url: 'https://internal.innoq.com'
		},
    */

    // There is no directory adaptors
    // Forgot to add that on commit?
    /*
		'./adaptors/innoq_com': {
			username: 'anon',
			password: 'none'
		},
    */
	}
}
