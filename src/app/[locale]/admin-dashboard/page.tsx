"use client";
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Filter,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { GetAllUsersParams, userApi } from "@/src/shared/api/user.api";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import dayjs from "@/src/shared/config/dayjs";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "patient" | "admin";
  avatar?: string;
  healthId?: string;
  createdAt: string;
}

export default function AdminUsersTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const { t, locale } = useTranslation();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetAllUsersParams = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const response = await userApi.admin.getAllUsers(params);

      setUsers(response.data.users as any);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);

      if (error.response?.status === 401) {
        setError(t("admin.errors.unauthorized"));
      } else if (error.response?.status === 403) {
        setError(t("admin.errors.forbidden"));
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            t("admin.errors.fetchFailed")
        );
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setTimeout(fetchUsers, 100);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeleteLoading(userId);
      setError(null);

      await userApi.admin.deleteUser(userId);
      await fetchUsers();
      setShowDeleteModal(null);
    } catch (error: any) {
      console.error("Failed to delete user:", error);

      if (error.response?.status === 401)
        setError(t("admin.errors.deleteUnauthorized"));
      else if (error.response?.status === 403)
        setError(t("admin.errors.deleteForbidden"));
      else
        setError(
          error.response?.data?.message ||
            error.message ||
            t("admin.errors.deleteFailed")
        );
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "??";
  };

  const getSelectedUserName = () => {
    const user = users.find((u) => u.id === showDeleteModal);
    if (user) {
      return user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email;
    }
    return "";
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#1A66FE]" />
                {t("admin.userManagement.title")}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t("admin.userManagement.description")}
              </p>
            </div>
            <div className="px-3 py-1 bg-[#1A66FE]/10 border border-[#1A66FE]/20 rounded-full"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={fetchUsers}
                    className="mt-2 text-sm text-red-700 hover:text-red-800 underline font-medium"
                  >
                    {t("admin.userManagement.tryAgain")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t("admin.userManagement.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A66FE]/20 focus:border-[#1A66FE]"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleFilterChange(e.target.value)}
                  className="appearance-none w-40 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A66FE]/20 focus:border-[#1A66FE] bg-white"
                >
                  <option value="">{t("admin.userManagement.allRoles")}</option>
                  <option value="patient">{t("admin.roles.patient")}</option>
                  <option value="admin">{t("admin.roles.admin")}</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#1A66FE] hover:bg-[#1A66FE]/90 text-white rounded-lg transition-colors"
              >
                {t("admin.userManagement.search")}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  {t("admin.userManagement.table.user")}
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  {t("admin.userManagement.table.email")}
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  {t("admin.userManagement.table.role")}
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  {t("admin.userManagement.table.healthId")}
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">
                  {t("admin.userManagement.table.joined")}
                </th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">
                  {t("admin.userManagement.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td colSpan={6} className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    {t("admin.userManagement.noUsers")}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A66FE] flex items-center justify-center text-white font-medium">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getUserInitials(user.firstName, user.lastName)
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-[#1A66FE] text-white"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role === "admin"
                          ? t("admin.roles.admin")
                          : t("admin.roles.patient")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {user.healthId || "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title={t("admin.userManagement.actions.view")}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(user.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title={t("admin.userManagement.actions.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="flex items-center px-3 py-2 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("admin.userManagement.pagination.previous")}
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }).map(
                  (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: pageNumber,
                          }))
                        }
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          pagination.page === pageNumber
                            ? "bg-[#1A66FE] text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
                className="flex items-center px-3 py-2 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t("admin.userManagement.pagination.next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("admin.userManagement.deleteModal.title")}
            </h3>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t("admin.userManagement.deleteModal.cancel")}
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteModal)}
                disabled={deleteLoading === showDeleteModal}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteLoading === showDeleteModal
                  ? t("admin.userManagement.deleteModal.deleting")
                  : t("admin.userManagement.deleteModal.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
