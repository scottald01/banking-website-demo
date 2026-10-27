import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const FX_CLEARANCE_FEE = 300;

const initialAccounts = [
  { id: 'checking', name: 'Everyday Checking', number: '2340 0981 24', balance: 8425.62, type: 'Checking', accent: '#0c4fe4' },
  { id: 'savings', name: 'High Yield Savings', number: '8923 0077 19', balance: 15600.0, type: 'Savings', accent: '#09a4d8' },
  { id: 'travel', name: 'Travel Rewards', number: '9981 1244 08', balance: 4820.25, type: 'Credit', accent: '#1b2a5e' },
];

const initialTransfers = [
  { id: 1, recipient: 'Maya Patel', account: '7710 0944 44', amount: 250, fee: FX_CLEARANCE_FEE, total: 550, date: 'Today, 09:15 AM', type: 'Local transfer' },
  { id: 2, recipient: 'Daniel Kim', account: '1100 2884 28', amount: 120, fee: FX_CLEARANCE_FEE, total: 420, date: 'Yesterday, 6:40 PM', type: 'P2P' },
  { id: 3, recipient: 'Liam Chen', account: '8831 8201 17', amount: 650, fee: FX_CLEARANCE_FEE, total: 950, date: 'Mon, 11:20 AM', type: 'Wire transfer' },
];

const initialBills = [
  { name: 'Rent', amount: 1800, due: 'Due in 3 days' },
  { name: 'Internet', amount: 78, due: 'Due in 6 days' },
  { name: 'Insurance', amount: 160, due: 'Due in 9 days' },
];

const spendingCategories = [
  { label: 'Housing', value: 34, amount: 4200 },
  { label: 'Food', value: 21, amount: 1800 },
  { label: 'Travel', value: 18, amount: 1500 },
  { label: 'Bills', value: 16, amount: 1200 },
  { label: 'Other', value: 11, amount: 760 },
];

const weeklySpend = [66, 72, 85, 64, 92, 78, 58];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);

const navItems = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Transfers', to: '/transfer' },
  { label: 'Accounts', to: '/dashboard' },
  { label: 'Cards', to: '/dashboard' },
  { label: 'Insights', to: '/dashboard' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transfers, setTransfers] = useState(initialTransfers);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts]
  );

  const handleLogin = () => setIsLoggedIn(true);

  const handleTransfer = ({ recipient, accountNumber, amount, memo }) => {
    const transferAmount = Number(amount);
    const fee = FX_CLEARANCE_FEE;
    const totalDebited = transferAmount + fee;

    const updatedAccounts = accounts.map((account) => {
      if (account.id === 'checking') {
        return { ...account, balance: Number((account.balance - totalDebited).toFixed(2)) };
      }
      return account;
    });

    setAccounts(updatedAccounts);
    setTransfers((current) => [
      {
        id: Date.now(),
        recipient,
        account: accountNumber,
        amount: transferAmount,
        fee,
        total: totalDebited,
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
              {weeklySpend.map((value, index) => (
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
                  <span>{formatCurrency((transfer.total ?? (transfer.amount || 0) + (transfer.fee || 0)))}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="finance-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Spending</p>
                <h3>Breakdown</h3>
              </div>
            </div>

            <div className="spend-list">
              {spendingCategories.map((category) => (
                <div key={category.label} className="spend-row">
                  <div className="sl-row-head">
                    <span>{category.label}</span>
                    <strong>{formatCurrency(category.amount)}</strong>
                  </div>
                  <div className="progress-line soft">
                    <span style={{ width: `${category.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Cards</p>
                <h3>Primary card</h3>
              </div>
            </div>

            <div className="credit-card">
              <div className="card-top">
                <span>National Trust</span>
                <span className="chip-mini">VISA</span>
              </div>
              <div className="card-number">•••• 4498</div>
              <div className="card-footer">
                <div>
                  <small>Cardholder</small>
                  <strong>Jordan Lewis</strong>
                </div>
                <div>
                  <small>Exp</small>
                  <strong>09/28</strong>
                </div>
              </div>
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
  const transferAmount = Number(form.amount || 0);
  const clearanceFee = FX_CLEARANCE_FEE;
  const totalDebited = transferAmount + clearanceFee;

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

    if (selectedAccount.balance < amount + clearanceFee) {
      setError('Insufficient funds. Please cover the transfer amount plus the $300 FX clearance fee.');
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
            <div className="fee-banner">
              <div>
                <strong>FX Clearance Fee</strong>
                <span>Applied separately to every transfer.</span>
              </div>
              <span className="fee-badge">{formatCurrency(clearanceFee)}</span>
            </div>

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

              <div className="fee-breakdown">
                <div className="fee-line">
                  <span>Transfer amount</span>
                  <strong>{formatCurrency(transferAmount)}</strong>
                </div>
                <div className="fee-line">
                  <span>FX clearance fee</span>
                  <strong>{formatCurrency(clearanceFee)}</strong>
                </div>
                <div className="fee-line total">
                  <span>Total charged</span>
                  <strong>{formatCurrency(totalDebited)}</strong>
                </div>
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
                  <span>{formatCurrency(transfer.total ?? (transfer.amount || 0) + (transfer.fee || 0))}</span>
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
