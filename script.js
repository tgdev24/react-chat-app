// import ReactDOM from 'react-dom';
// import React from 'react';

const DUMMY_DATA = [
	{
		senderId: "perbrogen",
		text: "hello mate"
	}, 
	{
		senderId: "whatevs",
		text: "who'll win?"
	}
]

const instanceLocator = "v1:us1:8c67c0fa-8074-4af7-b53f-7926775744bb"
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/8c67c0fa-8074-4af7-b53f-7926775744bb/token"
const username = "Thomas"
const roomId = 18764145


class App extends React.Component{
	//mnethod to create states
	constructor(){
		super()
		this.state={
			messages: DUMMY_DATA
		}
		this.sendMessage = this.sendMessage.bind(this);
	}
	//this is the method to connect react components with api's
	componentDidMount(){
		const chatManager = new Chatkit.ChatManager({
			instanceLocator: instanceLocator,
			userId: username,
			tokenProvider: new Chatkit.TokenProvider({
				url: testToken
			})
		});
		chatManager.connect().then(currentUser => {
			this.currentUser = currentUser
			this.currentUser.subscribeToRoom({
				roomId: roomId,
				hooks: {
					onNewMessage: message => {
						this.setState({
							// spread syntax used in react so that messages is copied then message is added to it
							messages: [...this.state.messages, message]
						});
					}
				}
			})
		}).catch(error => {
			console.error("error: ", error);
		});
	}

	sendMessage(text){
		this.currentUser.sendMessage({
			text, 
			roomId: roomId
		})
	}
	//method to send data to the html file
	render(){
		return(
			<div className="app">
				<Title />
				<MessageList messages={this.state.messages}/>
				<SendMessageForm sendMessage={this.sendMessage}/>
			</div>
		)
	}
}

class MessageList extends React.Component{
	render(){
		return (
			<ul className="messages-list">
				{this.props.messages.map(message => {
					return (
						<li className="msg" key={message.id}>
							<div className="m-author">{message.senderId}</div>
							<div className="m-text">{message.text}</div>
						</li>
					)
				})}
			</ul>
		)
	}
}

function Title(){
	return <p id="header">The Ting Chat</p>;
}

class SendMessageForm extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			message: ""
		}
		//the this keyword is by default undefined inside the body of a function.
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	handleSubmit(e){
		e.preventDefault();
		this.props.sendMessage(this.state.message)
		this.setState({
			message: ""
		})
	}
	handleChange(e){
		this.setState({
			message:e.target.value
		})
	}
	render(){
		return (
			<form onSubmit={this.handleSubmit} className="message-form">
				<input 
					id="typedmsg"
					onChange={this.handleChange}
					value={this.state.message}
					placeholder="Enter a message Ting"
					type="text" />
			</form>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'));