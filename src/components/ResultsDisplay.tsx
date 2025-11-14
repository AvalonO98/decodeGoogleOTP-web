import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface OTPParsedResult {
  name: string;
  issuer: string;
  secret: string;
  type: string;
  algorithm: string;
  digits: number;
  period: number;
}

interface ResultsDisplayProps {
  results: OTPParsedResult[];
}

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string;
  title: string;
}

interface ToastNotificationProps {
  message: string;
  isVisible: boolean;
}

const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, data, title }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && data) {
      QRCode.toDataURL(data)
        .then((url) => {
          setQrUrl(url);
        })
        .catch((error: Error) => {
          console.error('Error generating QR code:', error);
        });
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>{title}</h3>
        {qrUrl && <img src={qrUrl} alt="QR Code" className="qr-code-image" />}
        <div className="qr-modal-actions">
          <button 
            className="secondary-button"
            onClick={() => {
              navigator.clipboard.writeText(data);
              onClose();
            }}
          >
            复制URI
          </button>
        </div>
      </div>
    </div>
  );
};

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, isVisible }) => {
  return (
    <div className={`toast-notification ${isVisible ? 'visible' : ''}`}>
      {message}
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results = [] }) => {
  const [selectedItem, setSelectedItem] = useState<OTPParsedResult | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  const showCopyToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleCopySecret = (secret: string, label: string) => {
    navigator.clipboard.writeText(secret)
      .then(() => {
        showCopyToast(`${label}已复制到剪贴板`);
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  const handleShowQR = (item: OTPParsedResult) => {
    setSelectedItem(item);
    setShowQrModal(true);
  };

  const generateOtpUri = (item: OTPParsedResult): string => {
    const encodedIssuer = encodeURIComponent(item.issuer);
    const encodedName = encodeURIComponent(item.name);
    const label = item.issuer ? `${encodedIssuer}:${encodedName}` : encodedName;
    
    return `otpauth://${item.type.toLowerCase()}/${label}?secret=${item.secret}&issuer=${encodedIssuer}&algorithm=${item.algorithm}&digits=${item.digits}&period=${item.period}`;
  };

  if (results.length === 0) {
    return (
      <div className="results-container">
        <p className="no-results">暂无解析结果</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2>解析结果 ({results.length})</h2>
      <div className="results-list">
        {results.map((item, index) => (
          <div key={index} className="result-item">
            <div className="result-header">
              <div className="result-title">
                <span className="otp-type">
                  {item.type.toUpperCase() === 'TOTP' ? 'TOTP' : 'HOTP'}
                </span>
                <h3>
                  {item.issuer ? `${item.issuer} - ` : ''}{item.name}
                </h3>
              </div>
              <div className="result-actions">
                <button 
                  className="icon-button"
                  onClick={() => handleCopySecret(item.secret, '密钥')}
                  title="复制密钥"
                >
                  📋
                </button>
                <button 
                  className="icon-button"
                  onClick={() => handleShowQR(item)}
                  title="显示QR码"
                >
                  📱
                </button>
              </div>
            </div>
            <div className="result-details">
              <div className="result-row">
                <span className="result-label">密钥:</span>
                <span className="result-value">{item.secret}</span>
              </div>
              <div className="result-row">
                <span className="result-label">算法:</span>
                <span className="result-value">{item.algorithm}</span>
              </div>
              <div className="result-row">
                <span className="result-label">位数:</span>
                <span className="result-value">{item.digits}</span>
              </div>
              <div className="result-row">
                <span className="result-label">周期:</span>
                <span className="result-value">{item.period}秒</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        data={selectedItem ? generateOtpUri(selectedItem) : ''}
        title={selectedItem ? (selectedItem.issuer ? `${selectedItem.issuer} - ${selectedItem.name}` : selectedItem.name) : ''}
      />
      
      <ToastNotification message={toastMessage} isVisible={showToast} />
    </div>
  );
};

export default ResultsDisplay;
