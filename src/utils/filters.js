// 날짜 필터 쿼리
exports.applyDateFilter = (query, { from, to }, column = "created_at") => {
  if (from) {
    query = query.gte(column, `${from}T00:00:00`);
  }
  if (to) {
    query = query.lte(column, `${to}T23:59:59`);
  }
  return query;
};

// 검색 필터 쿼리
exports.applySearchFilter = (query, q, column) => {
  if (q) {
    query = query.ilike(column, `%${q}%`);
  }
  return query;
};

// 페이징 공통 함수
exports.getRange = ({ page = 1, limit = 10 }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return { from, to };
};
