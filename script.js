// 카드 이미지 목록
const cardImages = [
    'images/j2.png', 'images/j1.jpg', 'images/da.jpg', 'images/ha.jpg',
    'images/hk.jpg', 'images/hq.png', 'images/hj.webp', 'images/sa.jpg',
    'images/sj.png', 'images/sq.jpg', 'images/sk.jpg', 'images/ck.jpg',
    'images/cq.jpg', 'images/cj.jpg', 'images/c1.png', 'images/dk.jpg',
    'images/dq.jpg', 'images/dj.jpg'
];

// 상품 목록과 당첨 확률
const prizes = [
    { name: '5% 할인', probability: 10, type: 'discount' },
    { name: '10% 할인', probability: 10, type: 'discount' },
    { name: '20% 할인', probability: 5, type: 'discount' },
    { name: '30% 할인', probability: 5, type: 'discount' },
    { name: '상품권 3만원', probability: 5, type: 'voucher' },
    { name: '상품권 5만원', probability: 5, type: 'voucher' },
    { name: '음료수 1잔', probability: 20, type: 'drink' },
    { name: '커피 한잔', probability: 20, type: 'drink' },
    { name: '꽝', probability: 20, type: 'fail' }
];

let selectedCardIndex = -1;
let selectedPrize = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

// 게임 초기화
function initializeGame() {
    showScene(1);
    generateCards();
}

// Scene 전환 함수
function showScene(sceneNumber) {
    // 모든 scene 숨기기
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => scene.classList.remove('active'));
    
    // 해당 scene 보이기
    const targetScene = document.getElementById(`scene${sceneNumber}`);
    if (targetScene) {
        targetScene.classList.add('active');
    }
    
    // Scene별 특별 처리
    if (sceneNumber === 2) {
        generateCards();
    } else if (sceneNumber === 3) {
        startLottery();
    } else if (sceneNumber === 4) {
        showResult();
    } else if (sceneNumber === 5) {
        showCoupon();
    }
}

// 카드 생성 함수
function generateCards() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '';
    
    // 18개 카드 중 9개를 랜덤하게 선택
    const shuffledCards = [...cardImages].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 9);
    
    selectedCards.forEach((cardImage, index) => {
        const cardBtn = document.createElement('button');
        cardBtn.className = 'card-btn';
        cardBtn.innerHTML = `<img src="${cardImage}" alt="카드 ${index + 1}">`;
        cardBtn.addEventListener('click', () => selectCard(index, cardImage));
        cardGrid.appendChild(cardBtn);
    });
}

// 카드 선택 함수
function selectCard(index, cardImage) {
    selectedCardIndex = index;
    // 선택된 카드 이미지 저장
    window.selectedCardImage = cardImage;
    showScene(3);
}

// 추첨 시작 함수
function startLottery() {
    const shufflingContent = document.getElementById('shufflingContent');
    const shuffleSound = document.getElementById('shuffleSound');
    const scene3 = document.getElementById('scene3');
    
    // 기존 내용 초기화
    shufflingContent.innerHTML = '';
    
    // 프리미엄 셔플링 컨테이너 생성
    createPremiumShuffleContainer(shufflingContent);
    
    // 긴장감 효과 활성화
    scene3.classList.add('shuffling');
    
    // 셔플 사운드 재생
    shuffleSound.play().catch(e => console.log('Sound play failed:', e));
    
    let shuffleCount = 0;
    const maxShuffles = 50; // 5초 동안 빠르게 셔플
    let isShuffling = true;
    
    // 카드 이미지 셔플링
    const shuffleInterval = setInterval(() => {
        // 랜덤 카드 이미지 선택
        const randomCardImage = cardImages[Math.floor(Math.random() * cardImages.length)];
        const shuffleCard = document.querySelector('.shuffle-card-single img');
        
        if (shuffleCard) {
            shuffleCard.src = randomCardImage;
        }
        
        shuffleCount++;
        
        if (shuffleCount >= maxShuffles) {
            clearInterval(shuffleInterval);
            isShuffling = false;
            
            // 긴장감 효과 비활성화
            scene3.classList.remove('shuffling');
            
            // 회전 효과들 제거
            removeRotatingEffects();
            
            // 최종 상품 결정
            selectedPrize = selectPrizeByProbability();
            
            // 최종 결과 표시
            showFinalResult();
            
            // 2초 후 결과 화면으로 전환
            setTimeout(() => {
                showScene(4);
            }, 2000);
        }
    }, 100); // 더 빠른 셔플 (100ms 간격)
}

// 프리미엄 셔플링 컨테이너 생성
function createPremiumShuffleContainer(container) {
    const finalCardImage = window.selectedCardImage || cardImages[0];
    
    container.innerHTML = `
        <div class="premium-shuffle-container">
            <!-- 회전하는 별들 -->
            <div class="rotating-stars">
                ${Array(12).fill(0).map((_, i) => 
                    `<div class="star" style="transform: rotate(${i * 30}deg) translateX(180px); animation-delay: ${i * 0.1}s;">✨</div>`
                ).join('')}
            </div>

            <!-- 마법의 원들 -->
            <div class="magic-circles">
                <div class="magic-circle outer-circle"></div>
                <div class="magic-circle middle-circle"></div>
                <div class="magic-circle inner-circle"></div>
            </div>

            <!-- 빛나는 파티클들 -->
            <div class="sparkle-particles">
                ${Array(20).fill(0).map((_, i) => 
                    `<div class="particle" style="left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-delay: ${Math.random() * 2}s;">⭐</div>`
                ).join('')}
            </div>

            <!-- 중앙 카드 -->
            <div class="single-card-container shuffling">
                <div class="shuffle-card-single">
                    <img src="${finalCardImage}" alt="Shuffling card">
                </div>
            </div>

            <!-- 상태 텍스트 -->
            <div class="shuffle-status">추첨중...</div>
        </div>
    `;
}

// 회전 효과들 제거
function removeRotatingEffects() {
    const rotatingStars = document.querySelector('.rotating-stars');
    const magicCircles = document.querySelector('.magic-circles');
    const sparkleParticles = document.querySelector('.sparkle-particles');
    const singleCardContainer = document.querySelector('.single-card-container');
    const shuffleStatus = document.querySelector('.shuffle-status');
    
    if (rotatingStars) rotatingStars.style.display = 'none';
    if (magicCircles) magicCircles.style.display = 'none';
    if (sparkleParticles) sparkleParticles.style.display = 'none';
    if (singleCardContainer) {
        singleCardContainer.classList.remove('shuffling');
        singleCardContainer.classList.add('final');
    }
    if (shuffleStatus) shuffleStatus.textContent = '추첨 완료!';
}

// 최종 결과 표시
function showFinalResult() {
    const finalCardImage = window.selectedCardImage || cardImages[0];
    const shuffleCard = document.querySelector('.shuffle-card-single img');
    
    if (shuffleCard) {
        shuffleCard.src = finalCardImage;
    }
    
    // 최종 카드 정보 표시
    const shufflingContent = document.getElementById('shufflingContent');
    const cardInfo = document.createElement('div');
    cardInfo.className = 'final-card-info';
    cardInfo.innerHTML = `
        <div class="selected-prize">${selectedPrize.name}</div>
    `;
    shufflingContent.appendChild(cardInfo);
}

// 확률에 따른 상품 선택
function selectPrizeByProbability() {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const prize of prizes) {
        cumulativeProbability += prize.probability;
        if (random <= cumulativeProbability) {
            return prize;
        }
    }
    
    // 기본값 (꽝)
    return prizes[prizes.length - 1];
}

// 결과 표시 함수
function showResult() {
    const resultContainer = document.getElementById('resultContainer');
    const celebration = document.getElementById('celebration');
    const failAnimation = document.getElementById('failAnimation');
    
    if (selectedPrize.type === 'fail') {
        // 꽝인 경우 - 큰 화면으로 제시
        resultContainer.innerHTML = `
            <div class="big-result-display fail-result">
                <h1 class="big-result-title">꽝, 아깝습니다.<br>다시 한번!</h1>
                <div class="big-result-icon">😢</div>
                <div class="big-result-message">다음 기회에 도전해보세요!</div>
            </div>
        `;
        
        // 꽝 애니메이션과 사운드
        failAnimation.classList.add('active');
        const failSound = document.getElementById('failSound');
        failSound.play().catch(e => console.log('Sound play failed:', e));
        
        // 4초 후 애니메이션 제거
        setTimeout(() => {
            failAnimation.classList.remove('active');
        }, 4000);
        
        // 6초 후 처음 화면으로 돌아가기
        setTimeout(() => {
            showScene(1);
        }, 6000);
        
    } else {
        // 당첨인 경우 - 큰 화면으로 제시
        resultContainer.innerHTML = `
            <div class="big-result-display success-result">
                <h1 class="big-result-title">🎉 축하합니다! 🎉</h1>
                <div class="big-result-prize">${selectedPrize.name}</div>
                <div class="big-result-subtitle">당첨!</div>
                <div class="big-result-icon">🎊</div>
            </div>
        `;
        
        // 향상된 축하 효과
        createEnhancedCelebration();
        const successSound = document.getElementById('successSound');
        successSound.play().catch(e => console.log('Sound play failed:', e));
        
        // 5초 후 쿠폰 화면으로 전환
        setTimeout(() => {
            showScene(5);
        }, 5000);
    }
}

// 향상된 축하 효과 생성
function createEnhancedCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.innerHTML = '';
    
    // 폭죽 효과 생성
    createFireworks(celebration);
    
    // 꽃놀이 효과 생성
    createFlowerPetals(celebration);
    
    // 색종이 효과 생성
    createConfetti(celebration);
    
    // 5초 후 제거
    setTimeout(() => {
        celebration.innerHTML = '';
    }, 5000);
}

// 폭죽 효과
function createFireworks(container) {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 80 + 10 + '%';
            firework.style.top = Math.random() * 60 + 20 + '%';
            
            // 폭죽 파티클들
            for (let j = 0; j < 12; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.transform = `rotate(${j * 30}deg)`;
                particle.style.backgroundColor = getRandomColor();
                firework.appendChild(particle);
            }
            
            container.appendChild(firework);
            
            // 1초 후 제거
            setTimeout(() => {
                if (firework.parentNode) {
                    firework.parentNode.removeChild(firework);
                }
            }, 1000);
        }, i * 200);
    }
}

// 꽃놀이 효과
function createFlowerPetals(container) {
    const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐'];
    
    for (let i = 0; i < 30; i++) {
        const petal = document.createElement('div');
        petal.className = 'flower-petal';
        petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDelay = Math.random() * 2 + 's';
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(petal);
    }
}

// 색종이 효과
function createConfetti(container) {
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
        container.appendChild(confetti);
    }
}

function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#ff9ff3', '#54a0ff', '#5f27cd'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 쿠폰 표시 함수
function showCoupon() {
    const couponContainer = document.getElementById('couponContainer');
    const couponCode = generateCouponCode();
    const expiryDate = getExpiryDate();
    
    couponContainer.innerHTML = `
        <div class="simple-coupon">
            <h3>🎉 축하합니다! 쿠폰을 받으세요</h3>
            <div class="coupon-details">
                <p><strong>상품:</strong> ${selectedPrize.name}</p>
                <p><strong>쿠폰 코드:</strong> <span class="coupon-code">${couponCode}</span></p>
                <p><strong>유효기간:</strong> ${expiryDate}</p>
                <p><strong>사용법:</strong> 사용시 쿠폰을 제시해주세요</p>
            </div>
        </div>
    `;
}

// 쿠폰 코드 생성
function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 만료일 계산 (수령일로부터 1개월)
function getExpiryDate() {
    const now = new Date();
    const expiryDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return expiryDate.toLocaleDateString('ko-KR');
}

// 쿠폰 저장 함수
function saveCoupon() {
    console.log('=== 쿠폰 저장 시작 ===');
    console.log('localStorage 지원 여부:', typeof(Storage) !== "undefined");
    
    // 브라우저 호환성 체크
    if (typeof(Storage) === "undefined") {
        alert('이 브라우저는 로컬 저장소를 지원하지 않습니다.\n다른 브라우저를 사용해주세요.');
        return;
    }
    
    try {
        const couponCodeElement = document.querySelector('.coupon-code');
        const couponDetailElements = document.querySelectorAll('.coupon-details p');
        
        console.log('쿠폰 코드 요소:', couponCodeElement);
        console.log('쿠폰 정보 요소들:', couponDetailElements);
        console.log('선택된 상품:', selectedPrize);
        
        // 더 상세한 오류 체크
        if (!couponCodeElement) {
            throw new Error('쿠폰 코드를 찾을 수 없습니다. (.coupon-code 요소 없음)');
        }
        
        if (!selectedPrize) {
            throw new Error('선택된 상품 정보가 없습니다. (selectedPrize 변수 없음)');
        }
        
        if (couponDetailElements.length < 4) {
            throw new Error('쿠폰 정보가 부족합니다. (.coupon-details p 요소가 ' + couponDetailElements.length + '개만 발견됨)');
        }
        
        const couponCode = couponCodeElement.textContent.trim();
        const expiryText = couponDetailElements[2].textContent.replace('유효기간: ', '').trim();
        const usageText = couponDetailElements[3].textContent.replace('사용법: ', '').trim();
        
        console.log('추출된 데이터:');
        console.log('- 쿠폰 코드:', couponCode);
        console.log('- 유효기간:', expiryText);
        console.log('- 사용법:', usageText);
        
        const couponData = {
            id: Date.now(), // 고유 ID
            prize: selectedPrize.name,
            code: couponCode,
            expiryDate: expiryText,
            usage: usageText,
            issueDate: new Date().toLocaleDateString('ko-KR'),
            issueTime: new Date().toLocaleTimeString('ko-KR'),
            used: false
        };
        
        console.log('저장할 쿠폰 데이터:', couponData);
        
        // 로컬 스토리지 저장 시도
        let savedCoupons = [];
        try {
            const existingData = localStorage.getItem('gameCoupons');
            console.log('기존 localStorage 데이터:', existingData);
            savedCoupons = existingData ? JSON.parse(existingData) : [];
        } catch (parseError) {
            console.warn('기존 데이터 파싱 실패, 새로 시작:', parseError);
            savedCoupons = [];
        }
        
        console.log('기존 저장된 쿠폰들:', savedCoupons);
        
        savedCoupons.push(couponData);
        
        // localStorage에 저장
        const dataToSave = JSON.stringify(savedCoupons);
        console.log('저장할 JSON 데이터:', dataToSave);
        
        localStorage.setItem('gameCoupons', dataToSave);
        
        // 저장 확인
        const savedData = localStorage.getItem('gameCoupons');
        console.log('저장 후 localStorage 확인:', savedData);
        
        if (!savedData) {
            throw new Error('localStorage에 데이터가 저장되지 않았습니다.');
        }
        
        // 저장된 데이터 파싱 테스트
        const parsedSavedData = JSON.parse(savedData);
        console.log('저장된 데이터 파싱 테스트:', parsedSavedData);
        
        if (parsedSavedData.length !== savedCoupons.length) {
            throw new Error('저장된 데이터의 개수가 일치하지 않습니다.');
        }
        
        // 성공 메시지와 함께 저장된 쿠폰 수 표시
        const totalCoupons = savedCoupons.length;
        
        // 즉시 이미지 다운로드 실행
        downloadCouponImageByData(couponData, totalCoupons - 1);
        
        showSaveSuccessMessage(totalCoupons);
        
        // 쿠폰저장 버튼 비활성화 (중복 저장 방지)
        const saveButton = document.querySelector('.action-btn[onclick="saveCoupon()"]');
        if (saveButton) {
            saveButton.textContent = '저장완료';
            saveButton.style.background = '#95a5a6';
            saveButton.onclick = null;
            saveButton.style.cursor = 'not-allowed';
        }
        
        console.log('=== 쿠폰 저장 완료 ===');
        console.log('총 저장된 쿠폰 수:', totalCoupons);
        
        // 추가 확인을 위한 즉시 검증
        setTimeout(() => {
            const verifyData = localStorage.getItem('gameCoupons');
            console.log('1초 후 저장 상태 재확인:', verifyData);
        }, 1000);
        
    } catch (error) {
        console.error('쿠폰 저장 실패:', error);
        console.error('오류 스택:', error.stack);
        
        // 더 자세한 오류 정보 제공
        let errorDetails = '오류 상세:\n';
        errorDetails += '- 메시지: ' + error.message + '\n';
        errorDetails += '- localStorage 지원: ' + (typeof(Storage) !== "undefined" ? '예' : '아니오') + '\n';
        errorDetails += '- 현재 URL: ' + window.location.href + '\n';
        errorDetails += '- 브라우저: ' + navigator.userAgent + '\n';
        
        alert('쿠폰 저장에 실패했습니다.\n\n' + errorDetails + '\n브라우저 콘솔(F12)에서 더 자세한 정보를 확인하세요.');
    }
}

// 저장 성공 메시지 표시
function showSaveSuccessMessage(totalCoupons) {
    // 기존 alert 대신 더 나은 UI로 메시지 표시
    const messageDiv = document.createElement('div');
    messageDiv.className = 'save-success-message';
    messageDiv.innerHTML = `
        <div class="success-icon">✅</div>
        <div class="success-text">쿠폰이 성공적으로 저장되었습니다!</div>
        <div class="success-detail">이미지 파일이 다운로드되고 있습니다.</div>
        <div class="success-detail">총 ${totalCoupons}개의 쿠폰이 저장되어 있습니다.</div>
        <div class="success-actions">
            <button onclick="testCouponStorage()" class="test-btn">저장 상태 확인</button>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // 5초 후 메시지 제거 (테스트 버튼 사용 시간 고려)
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// 쿠폰 저장 상태 테스트 함수
function testCouponStorage() {
    console.log('=== 쿠폰 저장 상태 테스트 ===');
    
    try {
        // localStorage 지원 확인
        if (typeof(Storage) === "undefined") {
            alert('localStorage가 지원되지 않습니다.');
            return;
        }
        
        // 저장된 데이터 확인
        const rawData = localStorage.getItem('gameCoupons');
        console.log('Raw localStorage 데이터:', rawData);
        
        if (!rawData) {
            alert('저장된 쿠폰이 없습니다.\n\nlocalStorage에 "gameCoupons" 키가 존재하지 않습니다.');
            return;
        }
        
        // 데이터 파싱 시도
        let parsedData;
        try {
            parsedData = JSON.parse(rawData);
        } catch (parseError) {
            alert('저장된 데이터가 손상되었습니다.\n\n파싱 오류: ' + parseError.message);
            return;
        }
        
        console.log('파싱된 데이터:', parsedData);
        
        if (!Array.isArray(parsedData)) {
            alert('저장된 데이터 형식이 올바르지 않습니다.\n\n배열이 아닌 ' + typeof(parsedData) + ' 타입입니다.');
            return;
        }
        
        // 성공 메시지
        let message = `✅ 쿠폰 저장 상태 정상!\n\n`;
        message += `총 저장된 쿠폰 수: ${parsedData.length}개\n\n`;
        
        if (parsedData.length > 0) {
            message += `최근 쿠폰 정보:\n`;
            const latest = parsedData[parsedData.length - 1];
            message += `- 상품: ${latest.prize}\n`;
            message += `- 코드: ${latest.code}\n`;
            message += `- 발급일: ${latest.issueDate} ${latest.issueTime}\n`;
            message += `- 유효기간: ${latest.expiryDate}`;
        }
        
        alert(message);
        
    } catch (error) {
        console.error('테스트 중 오류:', error);
        alert('테스트 중 오류가 발생했습니다:\n\n' + error.message);
    }
}

// 저장된 쿠폰 목록 보기 함수
function viewSavedCoupons() {
    console.log('=== localStorage 디버깅 정보 ===');
    console.log('localStorage 전체 내용:', localStorage);
    console.log('gameCoupons 키 값:', localStorage.getItem('gameCoupons'));
    
    const savedCoupons = JSON.parse(localStorage.getItem('gameCoupons') || '[]');
    console.log('파싱된 쿠폰 데이터:', savedCoupons);
    
    if (savedCoupons.length === 0) {
        alert('저장된 쿠폰이 없습니다.\n\n디버깅 정보:\n- localStorage 지원: ' + (typeof(Storage) !== "undefined" ? '예' : '아니오') + '\n- 브라우저 콘솔(F12)에서 더 자세한 정보를 확인하세요.');
        return;
    }
    
    // 가장 최근 쿠폰만 보여주기 (배열의 마지막 요소)
    const latestCoupon = savedCoupons[savedCoupons.length - 1];
    createCouponGallery([latestCoupon], savedCoupons.length);
}

// 쿠폰 갤러리 모달 생성
function createCouponGallery(coupons, totalCount = coupons.length) {
    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById('couponGalleryModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'couponGalleryModal';
    modal.className = 'coupon-gallery-modal';
    
    let modalContent = `
        <div class="coupon-gallery-content">
            <div class="coupon-gallery-header">
                <h2>🎫 최근 당첨 쿠폰 (총 ${totalCount}개 저장됨)</h2>
                <button class="close-gallery" onclick="closeCouponGallery()">✕</button>
            </div>
            <div class="coupon-gallery-grid">
    `;
    
    coupons.forEach((coupon, index) => {
        modalContent += `
            <div class="coupon-card" data-coupon-index="${index}">
                <div class="coupon-visual">
                    <div class="coupon-header">
                        <div class="coupon-logo">🎁</div>
                        <div class="coupon-title">${coupon.prize}</div>
                    </div>
                    <div class="coupon-code-section">
                        <div class="coupon-code-label">쿠폰 코드</div>
                        <div class="coupon-code-value">${coupon.code}</div>
                    </div>
                    <div class="coupon-details">
                        <div class="coupon-detail">📅 발급일: ${coupon.issueDate}</div>
                        <div class="coupon-detail">⏰ 유효기간: ${coupon.expiryDate}</div>
                        <div class="coupon-detail">📋 ${coupon.usage}</div>
                        <div class="coupon-status ${coupon.used ? 'used' : 'unused'}">
                            ${coupon.used ? '✅ 사용됨' : '🎫 미사용'}
                        </div>
                    </div>
                </div>
                <div class="coupon-actions">
                    <button class="download-coupon-btn" onclick="downloadCouponImage(${index})">
                        📥 이미지 다운로드
                    </button>
                    <button class="copy-code-btn" onclick="copyCouponCode('${coupon.code}')">
                        📋 코드 복사
                    </button>
                </div>
            </div>
        `;
    });
    
    modalContent += `
            </div>
            <div class="coupon-gallery-footer">
                <button class="download-all-btn" onclick="downloadAllCoupons()">
                    📦 모든 쿠폰 다운로드 (${totalCount}개)
                </button>
                <button class="view-all-btn" onclick="viewAllCoupons()">
                    📋 전체 쿠폰 목록 보기
                </button>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // 모달 표시 애니메이션
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 쿠폰 갤러리 닫기
function closeCouponGallery() {
    const modal = document.getElementById('couponGalleryModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// 개별 쿠폰 이미지 다운로드
function downloadCouponImage(couponIndex) {
    const savedCoupons = JSON.parse(localStorage.getItem('gameCoupons') || '[]');
    const coupon = savedCoupons[couponIndex];
    
    if (!coupon) {
        alert('쿠폰 정보를 찾을 수 없습니다.');
        return;
    }
    
    createSimpleCouponImage(coupon);
}

// 참고 이미지와 동일한 쿠폰 이미지 생성
function createSimpleCouponImage(coupon) {
    console.log('=== 텍스트만 쿠폰 생성 시작 ===');
    console.log('전달받은 쿠폰 데이터:', coupon);
    
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            throw new Error('Canvas를 생성할 수 없습니다.');
        }
        
        // 캔버스 크기
        canvas.width = 500;
        canvas.height = 300;
        
        // 청록색 외부 배경
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 흰색 내부 배경
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // 점선 테두리 (쿠폰 스타일)
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // 점선 패턴
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.setLineDash([]); // 점선 해제
        
        // 상품명 추출
        let couponText = '테스트 쿠폰';
        if (coupon && coupon.prize) {
            couponText = coupon.prize + ' 쿠폰';
            console.log('쿠폰에서 상품명 추출:', coupon.prize);
        }
        console.log('최종 텍스트:', couponText);
        
        // 제목
        ctx.fillStyle = '#FF69B4';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('🎉 축하합니다! 🎉', 250, 55);
        
        // 상품명 텍스트 (확실히 보이도록)
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(couponText, 250, 85);
        
        // 쿠폰 코드
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(60, 110, 380, 30);
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 110, 380, 30);
        
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(coupon.code || 'NO-CODE', 250, 130);
        
        // 유효기간
        ctx.fillStyle = '#0077B6';
        ctx.font = '14px Arial';
        ctx.fillText('🛍️ 유효기간: 1개월', 250, 165);
        
        // 사용법
        ctx.fillStyle = '#4ECDC4';
        ctx.font = '13px Arial';
        ctx.fillText('사용시 쿠폰을 제시해주세요', 250, 185);
        
        // 감사 메시지
        ctx.fillStyle = '#95A5A6';
        ctx.font = '12px Arial';
        ctx.fillText('이용해주셔서 감사합니다', 250, 205);
        
        // QR 코드 영역 (우하단)
        const qrSize = 60;
        const qrX = canvas.width - qrSize - 30;
        const qrY = canvas.height - qrSize - 30;
        
        // QR 코드 배경 (흰색)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        
        // QR 코드 테두리
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);
        
        // 간단한 QR 코드 패턴 생성
        ctx.fillStyle = '#000000';
        const cellSize = 3;
        for (let i = 0; i < qrSize / cellSize; i++) {
            for (let j = 0; j < qrSize / cellSize; j++) {
                // 의사 랜덤 패턴 (쿠폰 코드 기반)
                const hash = (coupon.code || 'DEFAULT').charCodeAt((i + j) % (coupon.code || 'DEFAULT').length);
                if ((hash + i * j) % 3 === 0) {
                    ctx.fillRect(qrX + i * cellSize, qrY + j * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // QR 코드 모서리 마커 (전문적인 느낌)
        const markerSize = 12;
        // 좌상단 마커
        ctx.fillRect(qrX + 2, qrY + 2, markerSize, markerSize);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX + 5, qrY + 5, markerSize - 6, markerSize - 6);
        
        // 우상단 마커
        ctx.fillStyle = '#000000';
        ctx.fillRect(qrX + qrSize - markerSize - 2, qrY + 2, markerSize, markerSize);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX + qrSize - markerSize + 1, qrY + 5, markerSize - 6, markerSize - 6);
        
        // 좌하단 마커
        ctx.fillStyle = '#000000';
        ctx.fillRect(qrX + 2, qrY + qrSize - markerSize - 2, markerSize, markerSize);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX + 5, qrY + qrSize - markerSize + 1, markerSize - 6, markerSize - 6);
        
        // QR 코드 라벨
        ctx.fillStyle = '#666666';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR', qrX + qrSize/2, qrY + qrSize + 12);
        
        // 이미지 다운로드
        const dataURL = canvas.toDataURL('image/png');
        const safePrizeName = (coupon.prize || 'coupon').replace(/[^a-zA-Z0-9가-힣]/g, '_');
        const safeCode = (coupon.code || 'NOCODE').replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `쿠폰_${safePrizeName}_${safeCode}.png`;
        
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showDownloadMessage('쿠폰 이미지가 다운로드되었습니다! 🎉');
        console.log('텍스트만 쿠폰 생성 완료');
        
    } catch (error) {
        console.error('쿠폰 이미지 생성 오류:', error);
        alert('쿠폰 이미지 생성에 실패했습니다: ' + error.message);
    }
}

// 모바일 최적화를 위해 복잡한 그래픽 함수 제거

// 모든 쿠폰 다운로드
function downloadAllCoupons() {
    const savedCoupons = JSON.parse(localStorage.getItem('gameCoupons') || '[]');
    
    if (savedCoupons.length === 0) {
        alert('다운로드할 쿠폰이 없습니다.');
        return;
    }
    
    // 각 쿠폰을 순차적으로 다운로드
    savedCoupons.forEach((coupon, index) => {
        setTimeout(() => {
            downloadCouponImageByData(coupon, index);
        }, index * 500); // 0.5초 간격으로 다운로드
    });
    
    showDownloadMessage(`${savedCoupons.length}개의 쿠폰 이미지 다운로드를 시작합니다!`);
}

// 전체 쿠폰 목록 보기
function viewAllCoupons() {
    const savedCoupons = JSON.parse(localStorage.getItem('gameCoupons') || '[]');
    
    if (savedCoupons.length === 0) {
        alert('저장된 쿠폰이 없습니다.');
        return;
    }
    
    // 모든 쿠폰을 보여주는 갤러리 생성
    createCouponGallery(savedCoupons, savedCoupons.length);
}

// 쿠폰 데이터로 직접 이미지 다운로드 (전체 다운로드용)
function downloadCouponImageByData(coupon, index) {
    console.log('=== 쿠폰 이미지 다운로드 시작 ===');
    console.log('쿠폰 데이터:', coupon);
    
    if (!coupon) {
        console.error('쿠폰 정보를 찾을 수 없습니다.');
        alert('쿠폰 정보를 찾을 수 없어 다운로드에 실패했습니다.');
        return;
    }
    
    try {
        createSimpleCouponImage(coupon);
        console.log('쿠폰 이미지 다운로드 완료');
    } catch (error) {
        console.error('쿠폰 이미지 생성 실패:', error);
        alert('쿠폰 이미지 생성에 실패했습니다: ' + error.message);
    }
}

// 쿠폰 코드 복사
function copyCouponCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showDownloadMessage('쿠폰 코드가 클립보드에 복사되었습니다!');
    }).catch(() => {
        // 클립보드 API가 지원되지 않는 경우
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showDownloadMessage('쿠폰 코드가 복사되었습니다!');
    });
}

// 다운로드 메시지 표시
function showDownloadMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'download-message';
    messageDiv.innerHTML = `
        <div class="download-message-content">
            <div class="download-icon">📥</div>
            <div class="download-text">${message}</div>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 2000);
}

// Canvas roundRect 폴리필 (구형 브라우저 지원)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// 게임 재시작 함수
function restartGame() {
    selectedCardIndex = -1;
    selectedPrize = null;
    showScene(1);
}

// 키보드 이벤트 처리
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const activeScene = document.querySelector('.scene.active');
        if (activeScene && activeScene.id === 'scene1') {
            showScene(2);
        }
    }
});

// 터치 이벤트 지원
document.addEventListener('touchstart', function(e) {
    // 터치 이벤트 처리
}, { passive: true });

// 오디오 프리로드
function preloadAudio() {
    const sounds = ['shuffleSound', 'failSound', 'successSound'];
    sounds.forEach(soundId => {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.load();
        }
    });
}

// 페이지 로드 완료 후 오디오 프리로드
window.addEventListener('load', function() {
    preloadAudio();
}); 