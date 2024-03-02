

const OK = (res, data, message = '', status = true) => {
    return res.status(200).json({
      status,
      message: message || '',
      data: data || null,
    });
  };
  
  const ERROR = (res, data, message = 'Error', status = false) => {
    return res.status(500).json({
      status,
      message: message || '',
      data :data || "",
    });
  };
  
  const UNAUTHORIZED = (res, data, message = 'Error', status = false) => {
    return res.status(401).json({
      status,
      message: message || '',
      data :data || "",
    });
  };
  
  const BAD = (res, data, message = 'Error', status = false) => {
    return res.status(400).json({
      status,
      data,
      message: message || '',
    });
  };
  
  const UNKNOWN = (res, data, message = 'Error', status = false) => {
    res.status(500).json({
      status,
      data,
      message: message || '',
    });
  };

export {OK,UNKNOWN,BAD,UNAUTHORIZED,ERROR} 