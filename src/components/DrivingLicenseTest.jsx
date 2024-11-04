import React, { useState } from 'react';

const DrivingLicenseTest = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    physical: {
      colorBlindness: false,
      farsightedness: false,
      astigmatism: false,
      reflexes: false
    },
    theoretical: {
      trafficSigns: 0,
      trafficLines: 0,
      rightOfWay: 0
    },
    practical: false,
    testDate: new Date().toISOString().split('T')[0]
  });

  // Calculate physical test result
  const calculatePhysicalResult = (physical) => {
    const passedTests = Object.values(physical).filter(test => test).length;
    return passedTests >= 3;
  };

  // Calculate theoretical test result
  const calculateTheoreticalResult = (theoretical) => {
    const totalScore = theoretical.trafficSigns + theoretical.trafficLines + theoretical.rightOfWay;
    return (totalScore / 150) * 100 >= 80;
  };

  // Calculate overall status
  const calculateOverallStatus = (candidate) => {
    const physicalPassed = calculatePhysicalResult(candidate.physical);
    const theoreticalPassed = calculateTheoreticalResult(candidate.theoretical);
    const practicalPassed = candidate.practical;

    if (!physicalPassed || !theoreticalPassed || !practicalPassed) {
      return "ไม่ผ่านการทดสอบ";
    }

    if (physicalPassed && theoreticalPassed && practicalPassed) {
      return "ผ่านการทดสอบ";
    }

    return "รอพิจารณา";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCandidate) {
      setCandidates(candidates.map(c => 
        c.id === currentCandidate.id ? {...formData, id: c.id} : c
      ));
    } else {
      setCandidates([...candidates, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      physical: {
        colorBlindness: false, //ตาบอดสี
        farsightedness: false, //สายตายาว
        astigmatism: false, //สายตาเอียงง
        reflexes: false //การตอบสนอง
      },
      theoretical: {
        trafficSigns: 0,
        trafficLines: 0,
        rightOfWay: 0
      },
      practical: false,
      testDate: new Date().toISOString().split('T')[0]
    });
    setCurrentCandidate(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const handleEdit = (candidate) => {
    setCurrentCandidate(candidate);
    setFormData(candidate);
    setShowForm(true);
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">ระบบบันทึกผลการทดสอบขอใบอนุญาตขับขี่</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือนามสกุล"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 max-w-sm"
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            เพิ่มผู้ทดสอบ
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ชื่อ"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="นามสกุล"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">การทดสอบร่างกาย</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formData.physical).map(test => (
                  <label key={test} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.physical[test]}
                      onChange={(e) => setFormData({
                        ...formData,
                        physical: {...formData.physical, [test]: e.target.checked}
                      })}
                      className="w-4 h-4"
                    />
                    {test}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">การทดสอบภาคทฤษฎี</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(formData.theoretical).map(subject => (
                  <div key={subject}>
                    <label className="block text-sm mb-1">{subject}</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.theoretical[subject]}
                      onChange={(e) => setFormData({
                        ...formData,
                        theoretical: {...formData.theoretical, [subject]: Number(e.target.value)}
                      })}
                      className="px-4 py-2 border rounded-lg w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.practical}
                  onChange={(e) => setFormData({...formData, practical: e.target.checked})}
                  className="w-4 h-4"
                />
                ผ่านการทดสอบภาคปฏิบัติ
              </label>
            </div>

            <div>
              <input
                type="date"
                value={formData.testDate}
                onChange={(e) => setFormData({...formData, testDate: e.target.value})}
                required
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {currentCandidate ? 'อัพเดท' : 'บันทึก'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {filteredCandidates.map(candidate => (
            <div key={candidate.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {candidate.firstName} {candidate.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    วันที่ทดสอบ: {candidate.testDate}
                  </p>
                  <p className={`mt-2 font-medium ${
                    calculateOverallStatus(candidate) === "ผ่านการทดสอบ" 
                      ? "text-green-600" 
                      : calculateOverallStatus(candidate) === "ไม่ผ่านการทดสอบ"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}>
                    สถานะ: {calculateOverallStatus(candidate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(candidate)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(candidate.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    ลบ
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">การทดสอบร่างกาย</h4>
                  <p className={calculatePhysicalResult(candidate.physical) ? "text-green-600" : "text-red-600"}>
                    {calculatePhysicalResult(candidate.physical) ? "ผ่าน" : "ไม่ผ่าน"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">การทดสอบภาคทฤษฎี</h4>
                  <p className={calculateTheoreticalResult(candidate.theoretical) ? "text-green-600" : "text-red-600"}>
                    {calculateTheoreticalResult(candidate.theoretical) ? "ผ่าน" : "ไม่ผ่าน"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">การทดสอบภาคปฏิบัติ</h4>
                  <p className={candidate.practical ? "text-green-600" : "text-red-600"}>
                    {candidate.practical ? "ผ่าน" : "ไม่ผ่าน"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrivingLicenseTest;