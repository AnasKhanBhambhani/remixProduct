import { redirect } from "@remix-run/node";
import { DeleteQuantity } from "~/apis/categories";

export const action = async ({ request }: { request: Request }) => {
    const formdata = await request.formData();
    const categoryId = formdata.get('categoryid');
    await DeleteQuantity(categoryId)
    return redirect('/dashboard/categorylist')
}
