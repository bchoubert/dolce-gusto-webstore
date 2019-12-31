
/**
 * MessageService
 * 
 * service to print messages as well as errors to the user (using the SnackBar element in the <App /> component)
 * we need an observer pattern to pass messages between components without a HOC
 */
const MessageService = {
  // Pattern observer : observer list
  observers: [],

  // Add an observer to the list
  addObserver: observer => MessageService.observers.push(observer),
  // Remove an observer from the list
  removeObserver: observer => MessageService.observers.splice(MessageService.observers.indexOf(observer), 1),
  // notify all observers when a new message needs to be printed
  // Important: there's no wait list. If two messages arrives in row, only the seconds got printed, not both /!\
  printMessage: message => MessageService.observers.forEach(observer => observer(message))
};

export default MessageService;
