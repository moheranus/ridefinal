import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Button, Drawer, Form, Input, Steps, Modal, message, AutoComplete, DatePicker, TimePicker, Radio } from 'antd';
import { BsAirplaneEnginesFill } from "react-icons/bs";
import { IoMdClock } from "react-icons/io";
import { TbTransformPointBottomLeft } from "react-icons/tb";
import { useAuth } from '../../../../authcontext/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import "./Service.css";
import ServiceSlider from './ServiceSlider';
import moment from 'moment';
const { Title, Paragraph } = Typography;
const { Step } = Steps;

const Service = React.forwardRef((props, ref) => {
  const [form] = Form.useForm();

  const { isAuthenticated, login, register } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [tripType, setTripType] = useState('oneWay');
  const [airportOptions, setAirportOptions] = useState([]);
  const [airports, setAirports] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [radioSelected, setRadioSelected] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [dropOffOptions, setDropOffOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const services = [
    {
      title: "Airport Service",
      description: "Pre-booked rides to and from the airport for peace of mind.",
      icon: <BsAirplaneEnginesFill className="service-icons" />,
    },
    {
      title: "Point to Point Service",
      description: "Non-airport service from your door to theirs. Anytime, anywhere.",
      icon: <TbTransformPointBottomLeft className="service-icons" />,
    },
    {
      title: "Hourly Charter",
      description: "At your service, for as long as you need. Available locally.",
      icon: <IoMdClock className="service-icons" />,
    }
  ];

  const showDrawer = (service) => {
    console.log('Selected Service:', service); // Log selected service
    setSelectedService(service);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedService(null);
    setCurrentStep(0);
    form.resetFields();
    setFormValues({});
  };


  const nextStep = async () => {
    try {
      const values = await form.validateFields();
      setFormValues((prevValues) => ({ ...prevValues, ...values }));
      setCurrentStep(currentStep + 1);
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };


  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const openLoginModal = () => {
    setLoginModalVisible(true);
  };

  const handleLogin = async (values) => {
    try {
      await login(values.username, values.password);
      message.success('Login successful');
      setLoginModalVisible(false);
      setCurrentStep(1); // Advance to Step 3 after login
    } catch (error) {
      message.error('Login failed');
    }
  };

  const openRegisterModal = () => {
    setRegisterModalVisible(true);
    setLoginModalVisible(false);
  };

  const handleRegister = async (values) => {
    try {
      await register(values.username, values.password);
      message.success('Registration successful');
      setRegisterModalVisible(false);
      setCurrentStep(2); // Advance to Step 3 after registration
    } catch (error) {
      message.error('Registration failed');
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookingData = {
        ...formValues,
        serviceType: selectedService?.title,
        vehicleId: selectedVehicle?._id,
        vehicleName: selectedVehicle?.vehicleName,
        image: selectedVehicle?.image,
        totalPrice: selectedVehicle?.price,
      };

      // Log the booking data to ensure it's correct
      console.log('Booking Data:', bookingData);

      const response = await axios.post('https://johnwayneshuttle.com/api/bookings', bookingData);

      // Log the full response to understand its structure
      console.log('Response:', response);

      if (response.status === 200 || response.status === 201) {
        message.success('Booking submitted successfully');
        closeDrawer();
      } else {
        message.error(`Failed to submit booking. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      message.error('An error occurred while submitting your booking');
    }
    finally {
      setLoading(false); // Reset loading to false after processing
    }
  };






  const getFieldLabel = (field) => {
    const labels = {
      airportName: 'Airport Name',
      pickupLocation: 'Pickup Location',
      lengthOfService: 'Length of Service',
      guestName: 'Guest Name',
      guestEmail: 'Guest Email',
      guestPhone: 'Guest Phone',
      guestAddress: 'Guest Address',
      tripType: 'Trip Type',
      pickupDate: 'Pickup Date',
      pickupTime: 'Pickup Time',
      chooseCar: 'Choose Car',
      hotelName: 'Hotel Name',
      dropoffLocation: 'Dropoff Location',
      // pickupDate: 'Pickup Date',
    returnPickupDate: 'Return Pickup Date',
    };
    return labels[field] || field;
  };

  const  fetchAirports = async () => {
    try {
      const res = await axios.get('https://johnwayneshuttle.com/api/airports');
      return res.data;
    } catch (error) {
      console.error('Error fetching airports:', error);
      return [];
    }


  }
  useEffect(() => {
    const fetchAirportsAndSetState = async () => {
      try {
        const airportsData = await fetchAirports();
        setAirports(airportsData);

      } catch (error) {
        console.error('Error setting airports state:', error);
      }
    };

    fetchAirportsAndSetState();

  }, []);

  const handleAirportInputChange = async (value) => {
    if (!value) {
      setAirportOptions([]);
      return;
    }

    try {
      const results = await fetchAirports();
      const filteredOptions = results.filter(airport =>
        airport.airportName.toLowerCase().startsWith(value.toLowerCase())
      );
      setAirportOptions(filteredOptions.map(airport => ({ value: airport.airportName })));
    } catch (error) {
      console.error('Error handling airport input change:', error);
    }


}
const fetchHotels = async () => {
  try {
    const res = await axios.get('https://johnwayneshuttle.com/api/hotels');
    return res.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}
useEffect(() => {
  const fetchHotelsAndSetState = async () => {
    try {
      const hotelsData = await fetchHotels();
      setHotels(hotelsData);
    } catch (error) {
      console.error('Error setting hotels state:', error);
    }
  };

  fetchHotelsAndSetState();
}, []);

useEffect(() => {
  if (vehicles.length === 0) {
    fetchVehicles();
  }
}, []);

const handleHotelInputChange = async (value) => {
  if (!value) {
    setHotelOptions([]);
    return;
  }

  try {
    const results = await fetchHotels();
    const filteredOptions = results.filter(hotel =>
      hotel.hotelName.toLowerCase().startsWith(value.toLowerCase())
    );
    setHotelOptions(filteredOptions.map(hotel => ({ value: hotel.hotelName })));
  } catch (error) {
    console.error('Error handling hotel input change:', error);
  }

}
const handleChooseCar = () => {
  setRadioSelected(true);
  fetchVehicles();
};


const fetchRoutes = async () => {
  try {
    const res = await axios.get('https://johnwayneshuttle.com/api/routes');
    return res.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

useEffect(() => {
  const fetchAirportsAndSetState = async () => {
    try {
      const airportsData = await fetchAirports();
      setAirports(airportsData);
    } catch (error) {
      console.error('Error setting airports state:', error);
    }
  };

  fetchAirportsAndSetState();

}, []);

useEffect(() => {
  const fetchHotelsAndSetState = async () => {
    try {
      const hotelsData = await fetchHotels();
      setHotels(hotelsData);
    } catch (error) {
      console.error('Error setting hotels state:', error);
    }
  };

  fetchHotelsAndSetState();
}, []);

useEffect(() => {
  const fetchRoutesAndSetState = async () => {
    try {
      const routesData = await fetchRoutes();
      setRoutes(routesData);
    } catch (error) {
      console.error('Error setting routes state:', error);
    }
  };

  fetchRoutesAndSetState();
}, []);





const handlePickupInputChange = async (value) => {
  if (!value) {
    setPickupOptions([]);
    return;
  }

  try {
    const results = await fetchRoutes();
    const filteredOptions = results.filter(route =>
      route.routeName.toLowerCase().startsWith(value.toLowerCase())
    );
    setPickupOptions(filteredOptions.map(route => ({ value: route.routeName })));
  } catch (error) {
    console.error('Error handling pickup input change:', error);
  }
};



const handleDropOffInputChange = async (value) => {
  if (!value) {
    setDropOffOptions([]);
    return;
  }

  try {
    const results = await fetchRoutes();
    const filteredOptions = results.filter(route =>
      route.routeName.toLowerCase().startsWith(value.toLowerCase())
    );
    setDropOffOptions(filteredOptions.map(route => ({ value: route.routeName })));
  } catch (error) {
    console.error('Error handling drop-off input change:', error);
  }
};

useEffect(() => {
  if (vehicles.length === 0) {
    fetchVehicles();
  }
}, []);

const fetchVehicles = async () => {
  try {
    const response = await fetch('https://johnwayneshuttle.com/api/vehicles');
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    const data = await response.json();
    setVehicles(data);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    message.error('Failed to fetch vehicles');
  }
};



const handleVehicleSelect = (vehicle) => {
  setSelectedVehicle(vehicle);
  console.log('Selected Vehicle:', vehicle);
};
const renderVehicles = () => {
  if (!radioSelected || vehicles.length === 0) {
    return null;
  }

  return (
    <div className='vehicle-list-cont'>
    <Row gutter={[16, 16]} style={{ marginTop: '20px' }} className='selectedCar'>
      {vehicles.map(vehicle => (
        <Col key={vehicle._id} xs={24} sm={12} md={8}>
          <Card
            className={`vehicle-card ${selectedVehicle && selectedVehicle._id === vehicle._id ? 'selected' : ''}`}
            cover={<img alt={vehicle.vehicleName} src={`https://johnwayneshuttle.com/${vehicle.image}`} className='selectedCarImage'/>}
            onClick={() => handleVehicleSelect(vehicle)}
          >
            <Card.Meta title={vehicle.vehicleName} description={`Passengers: ${vehicle.numberOfPassengers}, Price: ${vehicle.price}` } />
          </Card>
        </Col>
      ))}
    </Row>
    </div>
  );
};

  const steps = [
    {
      title: 'Step 1',
      content: (
        <>
          {selectedService && selectedService.title === "Airport Service" && (
            <div className='service-form-container'>
           <Form.Item
              name="tripType"
              label="Trip Type"
              rules={[{ required: true, message: 'Please select a trip type' }]}
            >
              <select onChange={(e) => setTripType(e.target.value)} value={tripType} className='select-form'>
                <option value="">Select trip type</option>
                <option value="oneWay">One Way</option>
                <option value="roundTrip">Round Trip</option>
              </select>
            </Form.Item>
            <Form.Item
              name="airportName"
              label="Airport Name"
              rules={[{ required: true, message: 'Please select Airport' }]}
            >
                  <AutoComplete
                placeholder="Select Airport"
                options={airportOptions}
                onChange={handleAirportInputChange}
              />
            </Form.Item>
            <Form.Item
              name="hotelName"
              label="Hotel/Residence /other"
              rules={[{ required: true, message: 'Please select hotel/residence' }]}
            >
                  <AutoComplete
                placeholder="Select hotel/residence"
                options={hotelOptions}
                onChange={handleHotelInputChange}
              />
            </Form.Item>

            <Form.Item
              name="pickupDate"
              label="Pickup Date"
              rules={[{ required: true, message: 'Please select the pickup date' }]}
            >
              <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < moment().startOf('day')} className='select-form'/>
            </Form.Item>
            <Form.Item
              name="pickupTime"
              label="Pickup Time"
              rules={[{ required: true, message: 'Please select the pickup time' }]}
            >
                            <TimePicker
  style={{ width: '100%' }}
  className='select-form'


/>
            </Form.Item>
            <Form.Item
        name="chooseCar"
        label="Choose Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Radio.Group onChange={handleChooseCar}>
          <Radio value="chooseCar">Choose Car</Radio>
        </Radio.Group>
      </Form.Item>
      {renderVehicles()}
       </div>
          )}
          {selectedService && selectedService.title === "Point to Point Service" && (
            <div className='service-form-container'>
               <Form.Item
              name="tripType"
              label="Trip Type"
              rules={[{ required: true, message: 'Please select a trip type' }]}
            >
              <select onChange={(e) => setTripType(e.target.value)} value={tripType} className='select-form'>
                <option value="">Select trip type</option>
                <option value="oneWay">One Way</option>
                <option value="roundTrip">Round Trip</option>
              </select>
            </Form.Item>
            <Form.Item
              name="pickupAddress"
              label="Pickup Address"
              rules={[{ required: true, message: 'Please enter the pickup address' }]}
            >
                  <AutoComplete
                placeholder="Enter the pickup address"
                options={pickupOptions}
                onChange={handlePickupInputChange}
              />
            </Form.Item>
            <Form.Item
              name="dropoffAddress"
              label="drop Off Address"
              rules={[{ required: true, message: 'Please enter the pickup address' }]}
            >
                  <AutoComplete
                placeholder="Enter drop off address"
                options={pickupOptions}
                onChange={handlePickupInputChange}
              />
            </Form.Item>
            <Form.Item
              name="pickupDate"
              label="Pickup Date"
              rules={[{ required: true, message: 'Please select the pickup date' }]}
            >
              <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < moment().startOf('day')} className='select-form'/>
            </Form.Item>
            <Form.Item
              name="pickupTime"
              label="Pickup Time"
              rules={[{ required: true, message: 'Please select the pickup time' }]}
            >
                            <TimePicker
  style={{ width: '100%' }}
  className='select-form'

/>
            </Form.Item>
            <Form.Item
        name="chooseCar"
        label="Choose Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Radio.Group onChange={handleChooseCar}>
          <Radio value="chooseCar">Choose Car</Radio>
        </Radio.Group>
      </Form.Item>
      {renderVehicles()}
      {tripType === 'roundTrip' && (
              <>


                <Form.Item
                  name="returnPickupDate"
                  label="Return Pickup Date"
                  rules={[{ required: true, message: 'Please select return pickup date' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}

                    className='select-form'/>
                </Form.Item>
                <Form.Item
                  name="returnPickupTime"
                  label="Return Pickup Time"
                  rules={[{ required: true, message: 'Please select Return pickup time' }]}
                >
                   <TimePicker
  style={{ width: '100%' }}
  className='select-form'

/>
                </Form.Item>




     <div>

     </div>


      </>

            )}


            </div>
          )}
          {selectedService && selectedService.title === "Hourly Charter" && (
            <div className='service-form-container'>
                <Form.Item
              name="pickupAddress"
              label="Pickup Address"
              rules={[{ required: true, message: 'Please enter the pickup address' }]}
            >
                  <AutoComplete
                placeholder="Enter the pickup address"
                options={pickupOptions}
                onChange={handlePickupInputChange}
              />
            </Form.Item>
            <Form.Item
              name="dropoffAddress"
              label="drop Off Address"
              rules={[{ required: true, message: 'Please enter the pickup address' }]}
            >
                  <AutoComplete
                placeholder="Enter drop off address"
                options={pickupOptions}
                onChange={handlePickupInputChange}
              />
            </Form.Item>
            <Form.Item
              name="hour"
              label="Select Hour"
              rules={[{ required: true, message: 'Please select hour' }]}
            >
              <select onChange={(e) => setTripType(e.target.value)} value={tripType} className='select-form'>
                <option value="">Select hour</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>

              </select>
            </Form.Item>
            <Form.Item
              name="pickupDate"
              label="Pickup Date"
              rules={[{ required: true, message: 'Please select the pickup date' }]}
            >
              <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < moment().startOf('day')} className='select-form'/>
            </Form.Item>
            <Form.Item
              name="pickupTime"
              label="Pickup Time"
              rules={[{ required: true, message: 'Please select the pickup time' }]}
            >
                            <TimePicker
  style={{ width: '100%' }}
  className='select-form'


/>
            </Form.Item>
            <Form.Item
        name="chooseCar"
        label="Choose Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Radio.Group onChange={handleChooseCar}>
          <Radio value="chooseCar">Choose Car</Radio>
        </Radio.Group>
      </Form.Item>
      {renderVehicles()}
            {tripType === 'roundTrip' && (
             <>


      </>

            )}
            </div>
          )}
        </>
      ),
    },
    !isAuthenticated && {
      title: 'Step 2',
      content: (
        <>
          <div className='guest-option-con'>
            <Button type="primary" onClick={openLoginModal}>
              Login to Continue
            </Button>
            <Button type="default" onClick={nextStep}>
              Continue as Guest
            </Button>
          </div>
        </>
      ),
    },
    {
      title: 'Step 3',
      content: (
        <>
          <div className='guestInfo-cont'>
          <Form.Item
            name="guestName"
            label="Name"
            rules={[{ required: true, message: 'Please enter guest name' }]}
          >
            <Input placeholder="Enter guest name" className='select-form' />
          </Form.Item>
          <Form.Item
            name="guestEmail"
            label="Email"
            rules={[{ required: true, message: 'Please enter guest email' }]}
          >
            <Input placeholder="Enter guest email" className='select-form' />
          </Form.Item>
          <Form.Item
            name="guestPhone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter guest phone' }]}
          >
            <Input placeholder="Enter guest phone" className='select-form' />
          </Form.Item>
          <Form.Item
            name="guestAddress"
            label="Address"
            rules={[{ required: true, message: 'Please enter guest address' }]}
          >
            <Input placeholder="Enter guest address" className='select-form' />
          </Form.Item>



        </div>
        </>
      ),
    },
    {
      title: 'Summary',
      content: (
        <div>
          <Title level={4}>Booking Summary</Title>
          <ul>
          {Object.entries(formValues).map(([field, value]) => (
            <li key={field}>
              <strong>{getFieldLabel(field)}:</strong>{' '}
              {value && value.$isDayjsObject ? value.format('YYYY-MM-DD') : value}
            </li>
          ))}
          {selectedService && (
            <li>
              <strong>Service Type:</strong> {selectedService.title}
            </li>
          )}
          {selectedVehicle && (
            <li>
              <strong>Selected Vehicle:</strong> {selectedVehicle.vehicleName}
              <br />
              <img
                src={`https://johnwayneshuttle.com/${selectedVehicle.image}`}
                alt={selectedVehicle.vehicleName}
                style={{ width: '200px', height: 'auto', marginTop: '10px' }}
              />
              <br />
              Passengers: {selectedVehicle.numberOfPassengers}, Price: {selectedVehicle.price}
            </li>
          )}
        </ul>
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <section id="service" ref={ref}>
      <div className='service-sliders'>
        <ServiceSlider />
      </div>
      <div className="about-content">
        <div className="nine">
          <h1>Our Services<span>Explore our services</span></h1>
        </div>
        <Row gutter={[16, 16]} className="about-section">
          {services.map((service, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card bordered={false} className="about-card">
                <Title level={4} className="about-card-title">
                  <div className='service-icon'>
                    {service.icon}
                  </div>
                  {service.title}
                </Title>
                <Paragraph>
                  {service.description}
                </Paragraph>
                <Button type="primary" className='book-btn' onClick={() => showDrawer(service)}>Book Now</Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Drawer
        title={selectedService ? selectedService.title : ''}
        open={drawerVisible}
        onClose={closeDrawer}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Steps current={currentStep}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} />
            ))}
          </Steps>
          <div className="steps-content">
            {steps[currentStep] && steps[currentStep].content}
          </div>
          <div className="steps-action">
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={nextStep}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit">Submit</Button>
            )}
            {currentStep > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
        </Form>
      </Drawer>
      <Modal
        title="Login"
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <Button type="link" onClick={openRegisterModal} style={{ marginLeft: '8px' }}>
            Register
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Register"
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form>
      </Modal>
    </section>
  );
});

export default Service;
