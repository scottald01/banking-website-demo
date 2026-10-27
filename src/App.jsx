import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const initialAccounts = [
  { id: 'checking', name: 'Everyday Checking', number: '2340 0981 24', balance: 8425.62, type: 'Checking' },
  { id: 'savings', name: 'High Yield Savings', number: '8923 0077 19', balance: 15600.0, type: 'Savings' },
  { id: 'travel', name: 'Travel Rewards', number: '9981 1244 08', balance: 4820.25, type: 'Credit' },
];

const initialTransfers = [
  { id: 1, recipient: 'Maya Patel', account: '7710 0944 44', amount: 250, date: 'Today, 09:15 AM', type: 'Local transfer' },
  { id: 2, recipient: 'Daniel Kim', account: '1100 2884 28', amount: 120, date: 'Yesterday, 6:40 PM', type: 'P2P' },
  { id: 3, recipient: 'Liam Chen', account: '8831 8201 17', amount: 650, date: 'Mon, 11:20 AM', type: 'Wire transfer' },
];

const initialBills = [
  { name: 'Rent', amount: 1800, due: 'Due in 3 days' },
  { name: 'Internet', amount: 78, due: 'Due in 6 days' },
  { name: 'Insurance', amount: 160, due: 'Due in 9 days' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);

const navItems = [
  { label: 'Overview', to: '/dashboard', active: true },
  { label: 'Transfers', to: '/transfer' },
  { label: 'Accounts', to: '/dashboard' },
  { label: 'Cards', to: '/dashboard' },
  { label: 'Insights', to: '/dashboard' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transfers, setTransfers] = useState(initialTransfers);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts]
  );

  const handleLogin = () => setIsLoggedIn(true);

  const handleTransfer = ({ recipient, accountNumber, amount, memo }) => {
    const nextAmount = Number(amount);
    const updatedAccounts = accounts.map((account) => {
      if (account.id === 'checking') {
        return { ...account, balance: Number((account.balance - nextAmount).toFixed(2)) };
      }
      return account;
    });

    setAccounts(updatedAccounts);
    setTransfers((current) => [
      {
        id: Date.now(),
        recipient,
        account: accountNumber,
        amount: nextAmount,
        date: 'Today, 11:45 AM',
        type: 'Local transfer',
        memo,
      },
      ...current,
    ]);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <DashboardPage
              accounts={accounts}
              totalBalance={totalBalance}
              transfers={transfers}
              bills={initialBills}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/transfer"
        element={
          isLoggedIn ? (
            <TransferPage accounts={accounts} onTransfer={handleTransfer} transfers={transfers} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'jordan@nationaltrustbank.com', password: 'password123' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-panel">
          <div className="brand-lockup">
            <div className="brand-mark">NT</div>
            <div>
              <p className="eyebrow">Private banking</p>
              <h2>National Trust Bank</h2>
            </div>
          </div>
          <div className="hero-box">
            <p>Banking designed for momentum.</p>
            <h1>More control. More clarity. More confidence.</h1>
            <ul>
              <li>Real-time cash insights</li>
              <li>Instant payment transfers</li>
              <li>Secure digital access</li>
            </ul>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-header">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h3>Sign in</h3>
            </div>
            <button type="button" className="chip">Secure</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span>Email</span>
              <input name="email" value={form.email} onChange={handleChange} type="email" />
            </label>

            <label>
              <span>Password</span>
              <input name="password" value={form.password} onChange={handleChange} type="password" />
            </label>

            <div className="form-row">
              <label className="checkbox-row">
                <input type="checkbox" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              <a href="/" className="text-link">Forgot password?</a>
            </div>

            <button className="primary-btn" type="submit">Sign in</button>
            <button type="button" className="secondary-btn">Create account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ accounts, totalBalance, transfers, bills }) {
  const location = useLocation();
  const navigate = useNavigate();

  const cardSpend = [35, 52, 68, 45, 74, 90, 58];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">NT</div>
          <div>
            <p className="eyebrow">Banking</p>
            <h4>National Trust</h4>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={location.pathname === item.to ? 'nav-item active' : 'nav-item'}
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="side-card">
          <p className="eyebrow">Savings goal</p>
          <h3>$18,500</h3>
          <div className="progress-line">
            <span style={{ width: '68%' }} />
          </div>
          <div className="side-meta">
            <span>$12,460 saved</span>
            <span>68%</span>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Good morning</p>
            <h2>Welcome, Jordan</h2>
          </div>

          <div className="top-actions">
            <button type="button" className="ghost-btn" onClick={() => navigate('/transfer')}>Transfer</button>
            <div className="user-pill">JL</div>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card feature-card">
            <div className="stat-header">
              <span className="eyebrow">Available balance</span>
              <span className="tag positive">+2.8%</span>
            </div>
            <h3>{formatCurrency(totalBalance)}</h3>
            <div className="stat-foot">
              <span>Updated 2 mins ago</span>
              <button type="button">View details</button>
            </div>
          </article>

          <article className="stat-card">
            <span className="eyebrow">Monthly income</span>
            <h3>$12,400</h3>
            <p>+ $1,820 this month</p>
          </article>

          <article className="stat-card">
            <span className="eyebrow">Savings</span>
            <h3>$18,220</h3>
            <p>On track to target</p>
          </article>
        </section>

        <section className="content-grid">
          <div className="panel wide-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Overview</p>
                <h3>Cashflow</h3>
              </div>
              <button type="button" className="mini-button">This month</button>
            </div>

            <div className="chart-bars">
              {cardSpend.map((value, index) => (
                <div key={index} className="bar-column">
                  <span className="bar" style={{ height: `${value}%` }} />
                  <small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Bills</p>
                <h3>Upcoming</h3>
              </div>
            </div>

            <div className="bill-list">
              {bills.map((bill) => (
                <div className="bill-item" key={bill.name}>
                  <div>
                    <strong>{bill.name}</strong>
                    <small>{bill.due}</small>
                  </div>
                  <span>{formatCurrency(bill.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Accounts</p>
                <h3>Portfolio</h3>
              </div>
            </div>

            <div className="account-list">
              {accounts.map((account) => (
                <div key={account.id} className="account-item">
                  <div>
                    <strong>{account.name}</strong>
                    <small>{account.type} • {account.number}</small>
                  </div>
                  <span>{formatCurrency(account.balance)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Transfers</p>
                <h3>Recent</h3>
              </div>
            </div>

            <div className="transfer-list">
              {transfers.map((transfer) => (
                <div className="transfer-item" key={transfer.id}>
                  <div>
                    <strong>{transfer.recipient}</strong>
                    <small>{transfer.type} • {transfer.date}</small>
                  </div>
                  <span>{formatCurrency(transfer.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function TransferPage({ accounts, onTransfer, transfers }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fromAccount: 'checking',
    recipient: '',
    accountNumber: '',
    amount: '',
    memo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedAccount = accounts.find((account) => account.id === form.fromAccount) || accounts[0];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.recipient || !form.accountNumber || !form.amount) {
      setError('Please complete the required transfer details.');
      setSuccess('');
      return;
    }

    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Transfer amount must be greater than zero.');
      setSuccess('');
      return;
    }

    if (selectedAccount.balance < amount) {
      setError('Insufficient funds in the selected account.');
      setSuccess('');
      return;
    }

    onTransfer({
      recipient: form.recipient,
      accountNumber: form.accountNumber,
      amount: form.amount,
      memo: form.memo,
    });

    setSuccess('Transfer scheduled successfully.');
    setError('');
    setForm({
      fromAccount: 'checking',
      recipient: '',
      accountNumber: '',
      amount: '',
      memo: '',
    });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">NT</div>
          <div>
            <p className="eyebrow">Banking</p>
            <h4>National Trust</h4>
          </div>
        </div>

        <nav className="nav-list">
          <button type="button" className="nav-item" onClick={() => navigate('/dashboard')}>Overview</button>
          <button type="button" className="nav-item active" onClick={() => navigate('/transfer')}>Transfers</button>
          <button type="button" className="nav-item" onClick={() => navigate('/dashboard')}>Accounts</button>
        </nav>

        <div className="side-card">
          <p className="eyebrow">Selected account</p>
          <h3>{selectedAccount.name}</h3>
          <p className="side-balance">{formatCurrency(selectedAccount.balance)}</p>
        </div>
      </aside>

      <main className="main-panel transfer-layout">
        <header className="topbar transfer-header">
          <div>
            <p className="eyebrow">Money movement</p>
            <h2>Send a transfer</h2>
          </div>
        </header>

        <div className="transfer-grid">
          <section className="panel transfer-form-panel">
            <form onSubmit={handleSubmit} className="transfer-form">
              <div className="form-row horizontal">
                <label>
                  <span>From account</span>
                  <select name="fromAccount" value={form.fromAccount} onChange={handleChange}>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-row horizontal">
                <label>
                  <span>Recipient name</span>
                  <input name="recipient" value={form.recipient} onChange={handleChange} placeholder="e.g. Natalie Green" />
                </label>
              </div>

              <div className="form-row horizontal">
                <label>
                  <span>Account number</span>
                  <input name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="0000 0000 0000" />
                </label>
              </div>

              <div className="form-row horizontal">
                <label>
                  <span>Amount</span>
                  <div className="currency-wrap">
                    <span>$</span>
                    <input name="amount" value={form.amount} onChange={handleChange} type="number" step="0.01" min="0" placeholder="0.00" />
                  </div>
                </label>
              </div>

              <div className="form-row horizontal">
                <label>
                  <span>Memo</span>
                  <input name="memo" value={form.memo} onChange={handleChange} placeholder="Optional" />
                </label>
              </div>

              {error && <div className="form-alert error">{error}</div>}
              {success && <div className="form-alert success">{success}</div>}

              <div className="transfer-actions">
                <button type="button" className="secondary-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
                <button type="submit" className="primary-btn">Send payment</button>
              </div>
            </form>
          </section>

          <aside className="panel transfer-summary">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Recent</p>
                <h3>Transfers</h3>
              </div>
            </div>

            <div className="transfer-list compact">
              {transfers.map((transfer) => (
                <div className="transfer-item" key={transfer.id}>
                  <div>
                    <strong>{transfer.recipient}</strong>
                    <small>{transfer.type}</small>
                  </div>
                  <span>{formatCurrency(transfer.amount)}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
