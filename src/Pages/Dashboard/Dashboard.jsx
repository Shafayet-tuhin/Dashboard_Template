import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';


const Dashboard = () => {

  const toast = useRef(null);


  const onButtonClick = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Button clicked successfully!' });
  }

  return (
    <div>
      Dashboard
      <Toast ref={toast} />

      <div className="card flex justify-content-center">
        <Button label="Check" icon="pi pi-check" onClick={onButtonClick} />
      </div>
    </div>
  )
}

export default Dashboard