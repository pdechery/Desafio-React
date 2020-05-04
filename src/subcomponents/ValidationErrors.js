import React from 'react'; 
import { Notification } from 'react-pnotify';

function ValidationErrors(props) {
  return (
    props.errors.map((error, index) => {
      return error !== '' && 
        <Notification
          key={index}
          type='error'
          title='Atenção'
          text={error}
          delay={2000}
          shadow={false}
          hide={false}
          nonblock={true}
          desktop={true}
        />
    })
  )
}

export default ValidationErrors;