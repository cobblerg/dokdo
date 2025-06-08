// 오늘 날짜를 기본값으로 설정
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('mealDate').value = `${year}-${month}-${day}`;
    getMealInfo();
});

async function getMealInfo() {
    const dateInput = document.getElementById('mealDate').value;
    const formattedDate = dateInput.replace(/-/g, '');
    
    // API URL 구성
    const apiUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=7121371&MLSV_YMD=${formattedDate}`;
    
    try {
        const response = await fetch(apiUrl);
        const xmlText = await response.text();
        
        // XML 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // 날짜 표시 업데이트
        const selectedDate = document.getElementById('selectedDate');
        selectedDate.textContent = `${dateInput} 급식 정보`;
        
        // 급식 정보 표시
        const mealContent = document.getElementById('mealContent');
        
        // 에러 체크
        const resultCode = xmlDoc.getElementsByTagName('CODE')[0]?.textContent;
        if (resultCode === 'INFO-200') {
            mealContent.innerHTML = '<p>해당 날짜의 급식 정보가 없습니다.</p>';
            return;
        }

        // 급식 정보 파싱
        const mealInfo = xmlDoc.getElementsByTagName('row')[0];
        if (mealInfo) {
            const menu = mealInfo.getElementsByTagName('DDISH_NM')[0]?.textContent || '정보 없음';
            const calories = mealInfo.getElementsByTagName('CAL_INFO')[0]?.textContent || '정보 없음';
            
            mealContent.innerHTML = `
                <h3>중식</h3>
                <p>${menu.replace(/<br\/>/g, '<br>')}</p>
                <p class="calories">칼로리: ${calories}</p>
            `;
        } else {
            mealContent.innerHTML = '<p>급식 정보를 불러올 수 없습니다.</p>';
        }
    } catch (error) {
        console.error('Error fetching meal data:', error);
        document.getElementById('mealContent').innerHTML = '<p>급식 정보를 불러오는 중 오류가 발생했습니다.</p>';
    }
}
