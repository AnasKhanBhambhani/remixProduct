import { redirect } from "@remix-run/node";
import { deleteQuantity } from "~/apis/categories";

export const action = async ({ request }: { request: Request }) => {
    const formdata = await request.formData();
    const categoryId = formdata.get('categoryid');
    await deleteQuantity(String(categoryId))
    return redirect('/dashboard/categorylist')
}
