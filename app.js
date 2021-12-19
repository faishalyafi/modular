// require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const routing = require('./routing/index')


app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
// app.use(express.static('asset/file'));
// app.use(express.static('asset/pdf'));
app.use( '/asset/file', express.static( 'asset/file' ) );
app.use( '/asset/pdf', express.static( 'asset/pdf' ) );


app.use('/', routing)

const port = 8863

app.listen(port, () => {
	console.log(` telah tersambung pada port : ${port}`)
});