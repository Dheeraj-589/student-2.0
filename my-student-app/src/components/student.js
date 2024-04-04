import React, { useState } from 'react';
import { Form, Input, Button, Upload, DatePicker, Col, Row, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import { message } from 'antd';
const StudentForm = () => {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    academicDetails: [
      {
        instituteName: '',
        degree: '',
        branch: '',
        yearOfPassOut: '',
        percentage: '',
        academicDocument: null,
      },
      {
        instituteName: '',  // Add these entries for intermediate details
        boardOfExamination: '',
        group: '',
        yearOfPassOut: '',
        percentage: '',
        academicDocument: null,
      },
      {
        instituteName: '',  // Add these entries for degree details
        degreeName: '',
        branch: '',
        yearOfPassOut: '',
        percentage: '',
        academicDocument: null,
      },
    ],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = (values) => {
    // Organize the form data before sending it
    const formData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      academicDetails: [
        {
          instituteName: values['instituteName-0'],
          boardOfExamination: values['boardOfExamination-0'],
          group: values['group-0'],
          yearOfPassOut: values['yearOfPassOut-0']? values['yearOfPassOut-0'].format('YYYY-MM') : '',
          percentage: values['percentage-0'],
          academicDocument: values['academicDocument-0'] && values['academicDocument-0'].length > 0 ? values['academicDocument-0'][0].name : null,
        },
        {
          instituteName: values['instituteName-1'],
          boardOfExamination: values['boardOfExamination-1'],
          group: values['group-1'],
          yearOfPassOut: values['yearOfPassOut-1']? values['yearOfPassOut-0'].format('YYYY-MM') : '',
          percentage: values['percentage-1'],
          academicDocument: values['academicDocument-1'] && values['academicDocument-1'].length > 0 ? values['academicDocument-1'][0].name : null,
        },
        {
          instituteName: values['instituteName-2'],
          degreeName: values['degreeName-2'],
          branch: values['branch-2'],
          yearOfPassOut: values['yearOfPassOut-2']? values['yearOfPassOut-0'].format('YYYY-MM') : '',
          percentage: values['percentage-2'],
          academicDocument: values['academicDocument-2'] && values['academicDocument-2'].length > 0 ? values['academicDocument-2'][0].name : null,
        },
      ],
    };
    
    
  
    // Assuming you have a file named 'data.json' in the 'data' folder
    const filePath = 'data/data.json';
    
    // Read the existing JSON file content
    fetch(filePath)
      .then(response => response.json())
      .then(existingData => {
        // Append the new form data directly to the existing data array
        existingData.push(formData);
  
        // Write the updated data back to the file
        fetch(filePath, {
          method: 'PUT',
          body: JSON.stringify(existingData),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(() => console.log('Data updated successfully'))
          .catch(error => console.error('Error updating data file:', error));
      })
      .catch(error => console.error('Error reading data file:', error));
      // const uniqueFilenames = formData.academicDetails.map((detail, index) => ({
      //   index,
      //   filename: detail.academicDocument ? detail.academicDocument.uniqueFileName : null,
      // }));
    // Continue with your existing code to send data to the server...
    
    setFormData(formData);

    // Display the confirmation modal
    setIsModalVisible(true);
  };
  const handleModalOk = () => {
    // Continue with submitting the form data
    fetch('http://localhost:3001/api/student', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // Handle server response...
        console.log('Form submitted successfully:', response);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      })
      .finally(() => {
        // Close the modal after submission
        setIsModalVisible(false);
      });
  };
  
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  // console.log(formData);
  

  const handleDateChange = (date, dateString, index) => {
    setFormData((prevData) => {
      const updatedAcademicDetails = [...prevData.academicDetails];
      updatedAcademicDetails[index].yearOfPassOut = dateString;
      return {
        ...prevData,
        academicDetails: updatedAcademicDetails,
      };
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedAcademicDetails = [...prevData.academicDetails];
      updatedAcademicDetails[index][name] = value;
      return {
        ...prevData,
        academicDetails: updatedAcademicDetails,
      };
    });
  };

  const normFile = (e, index) => {
    if (Array.isArray(e)) {
      return e;
    }
    const fileList = e && e.fileList;
    // const uniqueFileName = `file_${Date.now()}_${index}`;
    setFormData((prevData) => {
      const updatedAcademicDetails = [...prevData.academicDetails];
      updatedAcademicDetails[index].academicDocument = { fileList, /*uniqueFileName*/ };
      return {
        ...prevData,
        academicDetails: updatedAcademicDetails,
      };
    });
    return fileList;
  };

  const validateTextWithoutNumbers = (rule, value) => {
    return new Promise((resolve, reject) => {
      const regex = /^[^\d]+$/;
      if (value && !regex.test(value)) {
        reject('Please enter a valid value without numbers');
      } else {
        resolve();
      }
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Form form={form} layout="vertical" name="studentForm" onFinish={onFinish}>
        {/* Personal Details Section */}
        <h2 style={{ textAlign: 'left' }}>Personal Details</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name!' }]}>
              <Input onChange={(e) => handleInputChange(e, 0)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name!' }]}>
              <Input onChange={(e) => handleInputChange(e, 0)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 0)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: 'Please enter your number!' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 0)} />
            </Form.Item>
          </Col>
        </Row>

        {/* Secondary Education Section */}
        <h2 style={{ textAlign: 'left' }}>Secondary Education</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Institute Name"
              name="instituteName-0"
              rules={[
                { required: true, message: 'Please enter institute name!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 0)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Board of Examination"
              name="boardOfExamination-0"
              rules={[
                { required: true, message: 'Please enter board of examination!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 0)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Percentage"
              name="percentage-0"
              rules={[
                { required: true, message: 'Please enter percentage!' },
                { pattern: /^(100|\d{1,2})$/, message: 'Please enter a valid percentage!' },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 0)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Year of Pass Out"
              name="yearOfPassOut-0"
              rules={[{ required: true, message: 'Please enter year of pass out!' }]}
            >
              <DatePicker picker="month" format="YYYY-MM" onChange={(date, dateString) => handleDateChange(date, dateString, 0)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Academic Document Upload"
              name="academicDocument-0"
              valuePropName="fileList"
              getValueFromEvent={(e) => normFile(e, 0)}
              // extra="You can upload an academic document here."
            >
              <Upload name="academicDocument-0" action="http://localhost:3001/api/student/upload" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Intermediate Section */}
        <h2 style={{ textAlign: 'left' }}>Intermediate</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Institute Name"
              name="instituteName-1"
              rules={[
                { required: true, message: 'Please enter institute name!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 1)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Board of Examination"
              name="boardOfExamination-1"
              rules={[
                { required: true, message: 'Please enter board of examination!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 1)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Group"
              name="group-1"
              rules={[
                { required: true, message: 'Please enter group!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 1)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Percentage"
              name="percentage-1"
              rules={[
                { required: true, message: 'Please enter percentage!' },
                { pattern: /^(100|\d{1,2})$/, message: 'Please enter a valid percentage!' },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 1)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Year of Pass Out"
              name="yearOfPassOut-1"
              rules={[{ required: true, message: 'Please enter year of pass out!' }]}
            >
              <DatePicker picker="month" format="YYYY-MM" onChange={(date, dateString) => handleDateChange(date, dateString, 1)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Academic Document Upload"
              name="academicDocument-1"
              valuePropName="fileList"
              getValueFromEvent={(e) => normFile(e, 1)}
              // extra="You can upload an academic document here."
            >
              <Upload name="academicDocument-1" action="http://localhost:3001/api/student/upload-intermediate" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Degree Section */}
        <h2 style={{ textAlign: 'left' }}>Degree</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Institute Name"
              name="instituteName-2"
              rules={[
                { required: true, message: 'Please enter institute name!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 2)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Degree Name"
              name="degreeName-2"
              rules={[
                { required: true, message: 'Please enter degree name!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 2)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Branch"
              name="branch-2"
              rules={[
                { required: true, message: 'Please enter branch!' },
                { validator: validateTextWithoutNumbers },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 2)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Percentage"
              name="percentage-2"
              rules={[
                { required: true, message: 'Please enter percentage!' },
                { pattern: /^(100|\d{1,2})$/, message: 'Please enter a valid percentage!' },
              ]}
            >
              <Input onChange={(e) => handleInputChange(e, 2)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Year of Pass Out"
              name="yearOfPassOut-2"
              rules={[{ required: true, message: 'Please enter year of pass out!' }]}
            >
              <DatePicker picker="month" format="YYYY-MM" onChange={(date, dateString) => handleDateChange(date, dateString, 2)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Academic Document Upload"
              name="academicDocument-2"
              valuePropName="fileList"
              getValueFromEvent={(e) => normFile(e, 2)}
              // extra="You can upload an academic document here."
            >
              <Upload name="academicDocument-2" action="http://localhost:3001/api/student/upload-degree" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} >
          <Col span={12} offset={6} style={{ textAlign: 'center' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Modal
          title="Confirmation"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Confirm & Submit"
          cancelText="Go back and edit"
        >
          <p>Are you sure you want to submit the form?</p>
          <div>
            <h2>User Data Preview</h2>
            <p><strong>First Name:</strong> {formData.firstName}</p>
            <p><strong>Last Name:</strong> {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>

            {/* Preview academic details */}
            {formData.academicDetails.map((academicDetail, index) => (
              <div key={index}>
                <h3>Academic Detail {index + 1}</h3>
                <p><strong>Institute Name:</strong> {academicDetail.instituteName}</p>
                <p><strong>Board of Examination:</strong> {academicDetail.boardOfExamination}</p>
                <p><strong>Group/Degree:</strong> {academicDetail.degree || academicDetail.group}</p>
                <p><strong>Year of Pass Out:</strong> {academicDetail.yearOfPassOut}</p>
                <p><strong>Percentage:</strong> {academicDetail.percentage}</p>
                {/* Add more fields as needed */}
              </div>
            ))}
          </div>
        </Modal>
      </Form>
    </div>
  );
};

export default StudentForm;