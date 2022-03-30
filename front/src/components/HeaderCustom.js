import { useState, useRef } from 'react';
import { YMaps, Map, Placemark  } from 'react-yandex-maps';
import WarehouseClient from '../api/WarehouseClient.js';
import { Layout, Menu, Modal, Button, Alert, Row, Col, Badge, Typography, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCartContext } from "../hooks/CartContext";

const { Header } = Layout;
const { Item, SubMenu } = Menu;

const HeaderCustom = ({ auth, address, setAddress }) => {
  const { cartItems } = useCartContext();
  const warehouseClient = new WarehouseClient(auth);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const defaultMapState = { center: [55.76, 37.64], zoom: 10, controls: [] };
  const [mapState, setMapState] = useState(defaultMapState);
  const [errorMsg, setErrorMsg] = useState();
  const [yaMaps, setYaMaps] = useState();
  const searchRef = useRef(null);
  let map;

  const onYmapsLoad = ymaps => {
    setYaMaps(ymaps);
    new ymaps.SuggestView(searchRef.current);
  }

  const onAddressSelect = async () => {
    const fullAddress = searchRef.current.value;
    console.log(fullAddress);
    console.log(yaMaps);
    console.log(map);
    const result = await yaMaps.geocode(fullAddress);
        let geoObject = result.geoObjects.get(0),
                  error,
                  hint;
        if (geoObject) {
          const preciseProperty = 'metaDataProperty.GeocoderMetaData.precision';
          switch (geoObject.properties.get(preciseProperty)) {
            case 'exact':
                  break;
            case 'number':
            case 'near':
            case 'range':
            case 'street':
                  error = 'Неполный адрес, требуется уточнение';
                  hint = 'Уточните номер дома';
                  break;
            case 'other':
            default:
                  error = 'Неточный адрес, требуется уточнение';
                  hint = 'Уточните адрес';
            }
        } else {
          error = 'Адрес не найден';
          hint = 'Уточните адрес';
        }
        if (error) {
          setErrorMsg(error+"\n"+hint);
        } else {
          const coord = geoObject.geometry.getCoordinates();
          const shortAddress = geoObject.properties.get('name');
          const coords = { 'lat' : coord[0], 'lon' : coord[1]};
          const response = await warehouseClient.getNearestWarehouse(coords);
          if (response && response.success) {
            console.log(response.data);
            const warehouseId = response.data.id;
            setAddress({fullAddress, shortAddress, coord, warehouseId});
            setMapState({center: coord, zoom: 17, controls: []});
            setErrorMsg(null);
          } else {
            setErrorMsg("Доставка в указанную зону недоступна.");
            setMapState(defaultMapState);
            setAddress({});
          }
        }
  }

  return (
    <Header>
        <Menu theme="dark" mode="horizontal">
          <Item key={1}>
            <Link to="/">Home</Link>
          </Item>
          {auth.token ? (
            <Item key={2}>
              <Link to="/profile">Profile</Link>
            </Item>)
            : <></>
          }
          {auth.token ? (
            <Item key={3}>
              <Link to="/products">Products</Link>
            </Item>)
            : <></>
          }
          {auth.token ? (
            <Item key={4}>
                <Link to="/profile/cart">
                  Cart
                  {
                    cartItems == null
                      ? <></>
                      : <Badge style={{margin:"0px 0px 20px 0px"}} size="small"
                            count={Object.keys(cartItems).length} />
                  }

                </Link>
            </Item>)
            : <></>
          }
          {auth.token ? (
            <Item key={5} onClick={()=>setIsMapVisible(true)}>
              {address && Object.keys(address).length == 0
                ? <>Address</>
                : <>{address.shortAddress}</>
              }
            </Item>)
            : <></>
          }
          <Item key={auth.token ? 6 : 2}>
            <Link to={auth.token ? "/signout" : "/signin"}>
              {auth.token ? "SignOut" : "SignIn"}
            </Link>
          </Item>
        </Menu>
      <Modal
             width={700}
             centered={true}
             footer={null}
             title={
               address && Object.keys(address).length == 0
               ? "Select delivery address"
               : "Edit delivery address"
             }
             visible={isMapVisible || (auth.token && address && Object.keys(address).length == 0)}
             okText="Choose"
             onCancel = {() => setIsMapVisible(false)}
             onOk = {() => setIsMapVisible(false)}
      >
        <Row justify="center">
        <Col>
        {errorMsg ? <Alert message={errorMsg} type="error"/> : <></>}

            <span className="ant-input-group-wrapper" style={{width:600}}>
              <span className="ant-input-wrapper ant-input-group">
                <input  className="ant-input" ref={searchRef}
                        placeholder="Введите адрес доставки."
                />
                <span className="ant-input-group-addon">
                  <Typography.Link
                    onClick={() =>
                    {setMapState(defaultMapState);
                      setAddress({});
                      setErrorMsg(null);
                      searchRef.current.value = '';}}
                  >
                    <CloseOutlined style={{ fontSize: '20px' }} />
                  </Typography.Link>

                </span>
                <span className="ant-input-group-addon">
                  <Typography.Link onClick={() => onAddressSelect()}>
                    Choose
                  </Typography.Link>
                </span>
              </span>
            </span>
        <br/><br/>
        <YMaps
          query={
            { load: "package.full",
              apikey: "c38cdedb-7aae-49f6-8c6e-835eb77efb72"
            }}
        >
          <Map
            width={600}
            height={500}
            state={mapState}
            onLoad={onYmapsLoad}
            instanceRef={m => (map = m)}
          >
            {address && Object.keys(address).length == 0
              ? <></>
              : <Placemark geometry={address.coord} />
            }
          </Map>
        </YMaps>
        </Col>
        </Row>
      </Modal>
    </Header>
  );
}

export default HeaderCustom;
