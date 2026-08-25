// Master Configuration
const MASTER_KEY = "Digital Marketing"; // Website Unlock Password
let attemptsLeft = 3;
let selectedTargetCard = null;

// 1. Site-wide Master Security Gate
function unlockSite(e) {
    e.preventDefault();

    const inputPass = document.getElementById('masterPassInput').value.trim();
    const errContainer = document.getElementById('gateErrorMessage');
    const gateCard = document.getElementById('gateCard');

    if (attemptsLeft <= 0) return;

    if (inputPass.toLowerCase() === MASTER_KEY.toLowerCase()) {
        triggerExplosionBlast();
        
        document.getElementById('siteLockOverlay').classList.add('hidden');
        document.getElementById('mainContainer').classList.remove('blurred-site');
    } else {
        attemptsLeft--;
        document.getElementById('attemptsCount').innerText = attemptsLeft;
        
        gateCard.classList.add('shake-card');
        setTimeout(() => gateCard.classList.remove('shake-card'), 400);

        if (attemptsLeft > 0) {
            errContainer.innerText = `Incorrect Master Key! ${attemptsLeft} attempts remaining.`;
        } else {
            errContainer.innerText = "Access Locked! Refresh page to retry.";
            document.getElementById('masterPassInput').disabled = true;
            document.getElementById('unlockBtn').disabled = true;
        }
    }
}

// Full Blast Animation on successful site entry
function triggerExplosionBlast() {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#6366f1', '#fbbf24', '#06b6d4']
        });
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#6366f1', '#fbbf24', '#06b6d4']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// 2. Candidate Password Modal Handlers
function openCandidateModal(card) {
    if (!card.classList.contains('locked')) return;

    selectedTargetCard = card;
    document.getElementById('candidatePassInput').value = '';
    document.getElementById('candidateErrorMsg').innerText = '';
    
    const targetName = card.getAttribute('data-name');
    document.getElementById('modalTitle').innerText = `Decrypt Candidate`;
    document.getElementById('modalSub').innerText = `Enter "${targetName}" to unlock this position.`;

    document.getElementById('cardLockModal').classList.remove('hidden');
    document.getElementById('candidatePassInput').focus();
}

function closeCandidateModal() {
    selectedTargetCard = null;
    document.getElementById('cardLockModal').classList.add('hidden');
}

function validateCandidatePass(e) {
    e.preventDefault();
    if (!selectedTargetCard) return;

    const inputVal = document.getElementById('candidatePassInput').value.trim();
    const targetName = selectedTargetCard.getAttribute('data-name');
    const rankType = selectedTargetCard.getAttribute('data-type');
    const errElement = document.getElementById('candidateErrorMsg');

    if (inputVal.toLowerCase() === targetName.toLowerCase()) {
        const cardToReveal = selectedTargetCard;
        closeCandidateModal();

        cardToReveal.classList.remove('locked');
        cardToReveal.classList.add('revealed');

        let colors = ['#6366f1', '#ffffff'];
        if (rankType === 'gold') colors = ['#fbbf24', '#f59e0b', '#ffffff'];
        if (rankType === 'silver') colors = ['#cbd5e1', '#94a3b8', '#ffffff'];
        if (rankType === 'bronze') colors = ['#f97316', '#fb923c', '#ffffff'];

        const rect = cardToReveal.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 80,
            spread: 70,
            origin: { x: x, y: y },
            colors: colors
        });

    } else {
        errElement.innerText = `Incorrect password! Enter exact candidate name ("${targetName}").`;
    }
}