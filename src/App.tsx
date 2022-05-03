import { useCallback, useState } from 'react';
import axios from 'axios';
import './App.css';

let timer: NodeJS.Timeout | null = null;

interface PersonalInfo {
  "code": number,
  "qq": string,
  "name": string,
  "qlogo": string,
  "msg"?: string,
  "lvzuan": {
    "code": number,
    "subcode": number,
    "level": number,
    "vip": number,
    "score": number,
    "place": number,
    "payway": number,
    "isyear": number,
    "vendor": number
  }
}
const App = () => {
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [personalInfo, setpersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const throttle = (fn: Function, delay: number) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn();
        timer = null;
      }, delay);
    }
  }

  const getValue = (event: { target: any; }) => {
    const value = event.target.value;
    const regQQCode = /^[1-9][0-9]{4,10}$$/;
    if (!regQQCode.test(value)) {
      setErrorMsg('请输入正确的QQ');
      setpersonalInfo(null)
      return
    }
    setErrorMsg('');
    setLoading(true);
    axios.get(`https://api.uomg.com/api/qq.info?qq=${value}`)
      .then((response) => {
        setLoading(false);
        const { data } = response;
        if (data?.code === 1) {
          setpersonalInfo(data);
          return
        }
        data?.msg && setErrorMsg(data.msg);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrorMsg('服务器开小差~')
      });
  };


  const handleChange = useCallback((event: { target: { value: any; }; }) => {
    throttle(() => getValue(event), 1000);
  }, []);

  return (
    <div className="App">
      <div className='title'>QQ号查询</div>
      <div className='form-input'>
        <input type="text" maxLength={11} onChange={handleChange} />
      </div>
      {errorMsg && <div className='error-msg'>{errorMsg}</div>}
      {personalInfo && <div className='info'>
        <div className='head-img'><img src={personalInfo?.qlogo} alt='头像'></img></div>
        <div className='info-content'>
          <div className='name'>{personalInfo?.name}</div>
          <div className='value'>{personalInfo?.qq}</div>
        </div>
      </div>}
      {
        loading &&
        <div className="loader">
          <div className="loader-inner ball-pulse">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      }

    </div>
  );
}

export default App;
